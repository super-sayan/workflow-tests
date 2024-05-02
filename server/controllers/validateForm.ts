import { z } from 'zod';
import jwt from 'jsonwebtoken';

const formSchemaLogin = z.object({
  email: z.string()
    .min(1, { message: "Email is required" })
    .email({ message: "Email must be valid" }),
  password: z.string()
    .min(1, { message: "Password is required" })
});

const formSchemaSignup = z.object({
  email: z.string()
    .min(1, { message: "Please Enter your Email" })
    .email({ message: "Email must be valid" }),
  name: z.string()
    .min(1, { message: "Please Enter your Full Name" })
    .regex(/^[a-zA-Z]+\s[a-zA-Z]+$/, { message: "Must contain your First and Last name in English, divided by space" }),
  password: z.string()
    .min(1, { message: "Please Enter your password" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/, { message: "Must Contain at least 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character" }),
  password2: z.string()
    .min(1, { message: "You have to confirm your password" })
}).refine((data: { password: string; password2: string; }) => data.password === data.password2, {
  message: "Password must match!",
  path: ["password2"]
});

const formSchemaPost = z.object({
  email: z.string()
    .min(1, { message: "Please Enter your Email" })
    .email({ message: "Email must be valid" }),
  name: z.string()
    .min(1, { message: "Please Enter your Full Name" })
    .regex(/^[a-zA-Z]+\s[a-zA-Z]+$/, { message: "Must contain your First and Last name in English, divided by space" }),
  meal_kind: z.string()
    .min(1, { message: "Please choose your which type of Meal do you prefer" })
    .refine(value => ["Breakfast", "Business Lunch", "Dinner"].includes(value), { message: "Choose meal from the list" }),
  date: z.string()
    .min(1, { message: "Please choose the Date of your visit" })
    .refine(value => {
      const selectedDate = new Date(value);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate());
      const threeMonthsLater = new Date();
      threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
      return selectedDate >= tomorrow && selectedDate <= threeMonthsLater;
    }, { message: "Date must be from tomorrow and up to 3 months" }),
  time: z.string()
    .min(1, { message: "Please choose the Time of your visit" })
    .refine(value => {
      const [hours, minutes] = value.split(':').map(Number);
      return (hours >= 9 && hours <= 17 && minutes <= 59) || (hours === 18 && minutes === 0);
    }, { message: "Time must be between 9 and 18" }),
  appointment_remark: z.string()
    .optional(),
});

const validateLoginForm = (req, res) => {
  const formData = req.body;
  try {
    formSchemaLogin.parse(formData);
  } catch (error) {
    res.status(422).send();
    console.log(error.errors);
  }
};

const validateSignupForm = (req, res) => {
  const formData = req.body;
  try {
    formSchemaSignup.parse(formData);
  } catch (error) {
    res.status(422).send();
    console.log(error.errors);
  }
};

const validatePostForm = (req, res) => {
  const formData = req.body;
  const token = req.cookies.token;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (formData.email !== decoded.email) {
      return res.status(403).json({ message: "Email does not match the logged-in user" });
    }
    formSchemaPost.parse(formData);
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

export { validateLoginForm, validateSignupForm, validatePostForm };
