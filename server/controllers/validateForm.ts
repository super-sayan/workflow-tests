const Yup = require("yup");

const formSchemaLogin = Yup.object({
  email: Yup.string()
    .required("Email is required")
    .matches(
      /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
      "Email must be valid"
    ),
  password: Yup.string()
    .required("Password is required")
});

const formSchemaSignup = Yup.object({
  email: Yup
    .string()
    .required('Please Enter your Email')
    .matches(
      /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
      "Email must be valid"
    ),
  name: Yup
    .string()
    .required('Please Enter your Full Name')
    .matches(
      /^[a-zA-Z]+\s[a-zA-Z]+$/,
      "Must contain your First and Last name in English, devided by space"
    ),
  password: Yup
    .string()
    .required('Please Enter your password')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "Must Contain at least 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
    ),
  password2: Yup
    .string()
    .required('You have to confirm your password')
    .oneOf([Yup.ref("password"), null], "Passwords must match")
});

const formSchemaPost = Yup.object({
  email: Yup
    .string()
    .required('Please Enter your Email')
    .matches(
      /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
      "Email must be valid"
    ),
  name: Yup
    .string()
    .required('Please Enter your Full Name')
    .matches(
      /^[a-zA-Z]+\s[a-zA-Z]+$/,
      "Must contain your First and Last name in English, devided by space"
    ),
  meal_kind: Yup
    .string()
    .required('Please choose your which type of Meal do you prefer')
    .test('valid-meal', 'Choose meal from the list', (value: string | undefined) => {
      if (!value) return false;
      return ["Breakfast", "Business Lunch", "Dinner"].includes(value);
    }),
  date: Yup
    .string()
    .required('Please choose the Date of your visit')
    .test('valid-date', 'Date must be from tomorrow and up to 3 months', (value: string | undefined) => {
      if (!value) return false;
      const selectedDate = new Date(value);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate());
      const threeMonthsLater = new Date();
      threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
      return selectedDate >= tomorrow && selectedDate <= threeMonthsLater;
    }),
  time: Yup
    .string()
    .required('Please choose the Time of your visit')
    .test('valid-time', 'Time must be between 9 and 18', (value: string | undefined) => {
      if (!value) return false;
      const hours = parseInt(value.split(':')[0]);
      return hours >= 9 && hours <= 18;
    }),
  appointment_remark: Yup
    .string()
});

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
      if (formData.email !== req.session.user.email) {
        throw new Error("Email does not match the logged-in user");
      }
      console.log("Form is good");
    })
    .catch((err) => {
      res.status(422).send();
      console.log(err.errors);
    });
};


export { validateLoginForm, validateSignupForm, validatePostForm };
