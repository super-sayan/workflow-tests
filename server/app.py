# Imports
import json
from flask import Flask, request, jsonify
import psycopg2
import os
from datetime import datetime, timedelta, timezone
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, \
                               unset_jwt_cookies, jwt_required, current_user, JWTManager
from passlib.hash import sha256_crypt
from html import escape
import re


# Constants
DB_NAME = "feedback_db"
DB_USER = "postgres"
DB_HOST = "db-service"
PASS_PATTERN = r'^(.{0,7}|.{31,}|[^0-9]*|[^A-Z]*|[^a-z]*)$'
USERNAME_PATTERN = r'^(?:\d|\w|-){1,30}$'
NUM_RANGE_PATTERN = r'^[1-5]$'


app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = "2e120297aa8ca503866b44fd2883894e288ead1a924f57a5eab9919cdcd8d97a"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
jwt = JWTManager(app)


if 'POSTGRES_PASSWORD_FILE' in os.environ:
   with open(os.environ['POSTGRES_PASSWORD_FILE'], 'r') as f:
       password = f.read().strip()
else:
   password = os.environ['POSTGRES_PASSWORD']


class User():
     def __init__(self, user_dict):
         self.username = user_dict['username']
         self.id = user_dict['id']


@jwt.user_identity_loader
def user_identity_lookup(user):
    return user.id


@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    identity = jwt_data["sub"]
    result = query_db(f"SELECT * FROM users WHERE id={identity};")
    if result:
        return User(result[0])


@app.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            data = response.get_json()
            if type(data) is dict:
                data["access_token"] = access_token
                response.data = json.dumps(data)
        return response
    except (RuntimeError, KeyError):
        return response


@app.route('/sign_up', methods=["POST"])
def sign_up():
    """This function recieves username and password from client,
    validates them and create a user if requirements are met."""
    username = escape(request.json.get("username", None))
    user_pass = escape(request.json.get("password", None))

    # Check if one of the fields is empty
    if not username or not user_pass:
        return {"msg": "Invalid input: username or password is missing."}, 400
    
    # Check if username matches the required pattern
    if not re.findall(USERNAME_PATTERN, username):
        return {"msg": "Invalid input: Username doesn't match the requirements."}, 400

    # Check if password matches the required pattern
    if re.findall(PASS_PATTERN, user_pass):
        return {"msg": "Invalid input: Password doesn't match the requirements."}, 400
    results = query_db(f"SELECT * FROM users WHERE username='{username}';")

    # Check if a user with this name already exists
    if results:
        return {"msg": f"The username '{username}' is already taken."}, 400
    
    user_pass = sha256_crypt.hash(user_pass)
    query_db(f"""INSERT INTO users (username,password) 
             VALUES ('{username}', '{user_pass}');""")
    return {"msg": "You have signed up successfully."}, 200
    

@app.route('/token', methods=["POST"])
def create_token():
    """This function gets credentials from the client, and compares to DB data.
    If credentials are valid a token will be created and returned.
    """

    # Get credentials from client side login form
    username = escape(request.json.get("username", None))
    user_pass = escape(request.json.get("password", None))
    
    # Querying DB for the credentials
    results = query_db(f"SELECT * FROM users WHERE username='{username}';")

    # Check if the query fetched any user
    if not results:
        return {"msg": "Wrong username or password"}, 401
    true_pass = results[0]["password"]

    # Check if passwords match
    if not sha256_crypt.verify(user_pass, true_pass):
        return {"msg": "Wrong username or password"}, 401
    user = User(results[0])

    # If the credentials match, create an access token for the user
    access_token = create_access_token(identity=user)
    response = {"access_token":access_token}
    return response


@app.route('/logout', methods=['POST'])
def logout():
    """ This function deletes the cookies containing the access token for the user,
    and returns success message to the user.
    """
    response = jsonify({'msg': 'logout successful'})
    unset_jwt_cookies(response)
    return response


@app.route('/stats')
@jwt_required()
def get_my_surveys():
    # This function fetches from DB surveys by current user and returns them to client
    surveys = query_db(f"""SELECT title,id,is_disabled 
                       FROM surveys 
                       WHERE owner_id={current_user.id};""")
    
    # Check if any surveys were fetched
    if not surveys:
        return {"msg": "You haven't created any surveys yet."}
    return surveys


@app.route('/stats/<int:survey_id>')
@jwt_required()
def get_survey_stats(survey_id):
    # This function fetches stats for a specific survey and returns them to client.
    is_valid = query_db(f"""SELECT * FROM surveys 
                        WHERE id={survey_id} 
                        AND owner_id={current_user.id};""")

    # Check if survey is valid: 1) does the survey exist? 2) does current user own this survey?
    if not is_valid:
        return {"msg": "Error: This survey does not exist, or you are not permitted to view its stats."}, 400
    questions = query_db(f"""SELECT
                            q.id AS question_id,
                            q.question,
                            ROUND(AVG(a.answer)) AS average_answer,
                            COUNT(CASE WHEN a.answer=1 THEN 1 END) AS answer_1_count,
                            COUNT(CASE WHEN a.answer=2 THEN 1 END) AS answer_2_count,
                            COUNT(CASE WHEN a.answer=3 THEN 1 END) AS answer_3_count,
                            COUNT(CASE WHEN a.answer=4 THEN 1 END) AS answer_4_count,
                            COUNT(CASE WHEN a.answer=5 THEN 1 END) AS answer_5_count,
                            COUNT(*) AS total_entries
                            FROM questions q
                            LEFT JOIN answers a ON q.id=a.question_id
                            WHERE q.survey_id={survey_id}
                            GROUP BY q.id, q.question;""")
    stats_info = query_db(f"""SELECT
                            surveys.title,
                            COUNT(DISTINCT answers.user_id) AS entries
                            FROM surveys
                            JOIN answers ON surveys.id = answers.survey_id
                            WHERE surveys.id={survey_id}
                            GROUP BY surveys.title;""")
    
    # Check if any entries were found for this survey
    if not stats_info:
        return {"msg": "This survey doesn't have any entries yet."}, 400
    stats = {"info": stats_info[0], "questions": questions}    
    return stats


@app.route('/stats/<int:survey_id>/disable')
@jwt_required()
def disable_survey(survey_id):
    # This function gets a survey id from the client, validates it and sets to disabled.
    is_valid = query_db(f"""SELECT * FROM surveys
                            WHERE id={survey_id}
                            AND owner_id={current_user.id};""")
    
    # Check if survey exists and is owned by current user
    if not is_valid:
        return {"msg": "Error: This survey does not exist or you don't have permission" /
                "to disable it."}, 404
    query_db(f"""UPDATE surveys
              SET is_disabled=true
              WHERE id={survey_id};""")
    return {"msg": "survey was disabled successfully"}, 200


@app.route('/stats/<int:survey_id>/delete')
@jwt_required()
def delete_survey(survey_id):
# This function gets a survey id from the client, validates and deletes it.
    is_valid = query_db(f"""SELECT * FROM surveys
                            WHERE id={survey_id}
                            AND owner_id={current_user.id};""")
    
    # Check if survey exists and is owned by current user
    if not is_valid:
        return {"msg": "Error: This survey does not exist or you don't have permission" /
                "to delete it."}, 404
    query_db(f"""DELETE FROM surveys WHERE id={survey_id};""")
    return {"msg": "survey was deleted successfully"}


@app.route('/take_survey')
@jwt_required()
def get_all_surveys():
    # This function fetches available surveys from the db and returns them to the client
    ids_to_skip = query_db(f"""SELECT survey_id FROM answers
                           WHERE user_id={current_user.id};""")
    ids_to_skip = tuple([i['survey_id'] for i in ids_to_skip])

    # Check if any surveys shouldnt be shown because they were already answered by the user
    if not ids_to_skip:
        surveys = query_db(f"""SELECT * FROM surveys
                           WHERE is_disabled=false;""")
    else:
        surveys = query_db(f"""SELECT * FROM surveys 
                           WHERE id NOT IN {ids_to_skip}
                           AND is_disabled=false;""")
    
    # Check if any surveys were fetched
    if not surveys:
        return {"msg": "There are no available surveys right now"}
    return surveys


def is_survey_invalid(survey_id):
    """This function gets a survey id and checks if current user should be able to
    submit an answer.
    returns: None if valid. If invalid returns error message ( {"msg": "err description"}, 400 )"""
    survey_exists = query_db(f"""SELECT * FROM surveys
                             WHERE id={survey_id}
                             AND is_disabled=false;""")
    
    # Check if survey exists in the DB and not disabled
    if not survey_exists:
        return {"msg": "This survey does not exist, or you don't have permission to see it."}, 400
    is_unavailable = query_db(f"""SELECT * FROM answers 
                              WHERE user_id={current_user.id}
                              AND survey_id={survey_id};""")
    
    # Check if current user already took part in this survey
    if is_unavailable:
        return {"msg": "You already submitted an answer to this survey. " /
                "Thank you for participating!"}, 400


@app.route('/take_survey/<int:survey_id>')
@jwt_required()
def take_survey(survey_id):
    err_msg = is_survey_invalid(survey_id)
    
    # Check if survey is valid
    if err_msg:
        return err_msg
    questions = query_db(f"""SELECT id,question FROM questions 
                         WHERE survey_id={survey_id};""")
    return {"questions": questions}


@app.route('/take_survey/<int:survey_id>/send', methods=['POST'])
@jwt_required()
def send_survey(survey_id):
    """This function gets from client answers to a specific survey, validates the data
    and adds it to the DB if valid."""
    results = request.get_json()
    print(results)
    err_msg = is_survey_invalid(survey_id)
    
    # Check if survey is valid
    if err_msg:
        return err_msg
    
    # Go over all questions and their answers
    for question in results['questions']:
        is_q_valid = query_db(f"""SELECT * FROM questions
                               WHERE survey_id={survey_id}
                               AND id={question['id']};""")
        
        # Check if this question belongs to the survey
        if not is_q_valid:
            return {"msg": "Error: Invalid input"}, 400
        
        # If no value was submitted, set to default
        if not 'value' in question.keys():
            question['value'] = 3
        else:
            value = str(question['value'])
            is_valid = re.findall(NUM_RANGE_PATTERN, value)
            
            # Check if the answer is out of acceptable range (1-5)
            if not is_valid:
                return {"msg": "Error: Invalid input"}, 400 
        query_db(f"""INSERT INTO answers (question_id,survey_id,user_id,answer)
                 VALUES ({question['id']},{survey_id},{current_user.id},{int(question['value'])});""")
    
    return {"msg": "survey submitted successfully!"}, 200


@app.route('/submit_survey', methods=['POST'])
@jwt_required()
def submit_survey():
    """this function gets data for a new survey from the client, validates it and
        saves to the DB."""
    results = request.get_json()
    
    # Check if a title was entered
    if 'title' not in results.keys():
        return {"msg": "Error: You didn't enter a title"}
    title = results['title']
    questions = [escape(i['question']) for i in results['questions'] if i]
    
    # Check if Questions were entered
    if not questions:
        return {"msg": "Error: You didn't enter any questions"}
    survey_id = query_db(f"""INSERT INTO surveys (owner_id,title,is_disabled) 
                         VALUES ({current_user.id},'{title}',false)
                         RETURNING id;""")[0]['id']
    
    # Insert all questions to the DB
    for question in questions:
        query_db(f"""INSERT INTO questions (survey_id,question) 
                 VALUES ({survey_id},'{question}');""")

    return {"msg": "Survey was submitted successfully."}, 200


def query_db(query):
    """This function queries the DB and returns results as JSON.
    arguments: query (str)
    returns: output from DB in JSON format"""
    print(f'[debug] query: {query}')
    action = query.split()[0]
    with psycopg2.connect(host=DB_HOST, user=DB_USER, password=password, 
                          database=DB_NAME) as conn:
        conn.set_session(autocommit=True)
        with conn.cursor() as cur:
            cur.execute(query)
            
            # Check if there should be a return value
            if action == 'SELECT' or 'RETURNING' in query:
                row_headers = [x[0] for x in cur.description]
                results = cur.fetchall()  
    conn.close()
    if action == 'SELECT' or 'RETURNING' in query:
        results = [dict(zip(row_headers, result)) for result in results]
        print(f'[debug] query fetched: {results}, type: {type(results)}')
        return results


if __name__ == "__main__":
    app.run(host='0.0.0.0')
 