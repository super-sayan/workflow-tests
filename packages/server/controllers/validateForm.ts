const {formSchemaLogin, formSchemaSignup, formSchemaPost} = require("@happy-cat/common");

const validateLoginForm = (req, res) => {
  const formData = req.body;
  formSchemaLogin
    .validate(formData)
    .then(() => {
      console.log("form is good");
    })
    .catch((err) => {
      res.status(422).send();
      console.log(err.errors);
    });
};

const validateSignupForm = (req, res) => {
  const formData = req.body;
  formSchemaSignup
    .validate(formData)
    .then(() => {
      console.log("form is good");
    })
    .catch((err) => {
      res.status(422).send();
      console.log(err.errors);
    });
};

const validatePostForm = (req, res) => {
  const formData = req.body;
  formSchemaPost
    .validate(formData)
    .then(() => {
      console.log("form is good");
    })
    .catch((err) => {
      res.status(422).send();
      console.log(err.errors);
    });
};


export { validateLoginForm, validateSignupForm, validatePostForm };
