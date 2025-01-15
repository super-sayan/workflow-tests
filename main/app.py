from flask import Flask
import requests

BAD_SSL_SITE = 'https://expired.badssl.com/'

app = Flask(__name__)

@app.route('/bad_cert')
def bad_cert():
	"""This function is using a vulnerable version of the 'Session' object in the requests package.
	In a single session, after the first request is made with SSL verification disabled, all subsequent requests will also ignore SSL verification."""

	with requests.Session() as s:
		# First request to an expired ssl site will succeed as we are disabling SSL verification
		s.get(BAD_SSL_SITE, verify = False)
		
		# In second request, SSL verification should be enabled, but it will be disabled due to the vulnerability, and the request will succeed
		try:
			s.get(BAD_SSL_SITE, verify=True)
		except requests.exceptions.SSLError as e:
			return "SSL verification failed as expected. This is a security feature. Error: " + str(e)
	return f"requests version: {requests.__version__} - SSL verification bypassed, successfully connected to an expired SSL site ({BAD_SSL_SITE}). This is a security vulnerability."

@app.route('/')
def index():
	return "Hello! This is a simple Flask app, with some security vulnerabilities. Check /bad_cert for a demonstration of a vulnerability."

if __name__ == '__main__':
	app.run(host='0.0.0.0', port=5000)