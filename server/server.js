const express = require("express");
const { pool } = require("../dbConfig");
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
require("dotenv").config();
const app = express(); 
//newbie
const cors = require("cors");


// const PORT = process.env.PORT || 3000;
const PORT = process.env.PORT || 3001;

const initializePassport = require("../passportConfig");

initializePassport(passport);


// Parses details from a form
app.use(express.urlencoded({extended: false}));
app.set("view engine", "ejs");
//newbie
app.use(cors());
app.use(express.json());


app.use(
  session({
    // Key we want to keep secret which will encrypt all of our information
    secret: process.env.SESSION_SECRET,
    // Should we resave our session variables if nothing has changes which we dont
    resave: false,
    // Save empty value if there is no vaue which we do not want to do
    saveUninitialized: false
  })
);
// Funtion inside passport which initializes passport
app.use(passport.initialize());
// Store our variables to be persisted across the whole session. Works with app.use(Session) above
app.use(passport.session());
app.use(flash());

// app.get("/", (req, res) => {
//   res.render("index");
// });
app.get("/", (re, res) => {
  return res.json("From backend");
})

app.get("/users", (req, res )=> {
  pool.query(
    `SELECT * FROM users`,
    (err, results) => {
      if (err) return res.json(err);
      return res.json(results.rows);
    });
})

app.get("/appointments", (req, res )=> {
  pool.query(
    `SELECT * FROM appointments`,
    (err, results) => {
      if (err) return res.json(err);
      return res.json(results.rows);
    });
})


      // pool.query(
      //   `INSERT INTO appointments (name, email, meal_kind, appointment_remark, date, time)
      //       VALUES ($1, $2, $3, $4, $5, $6)
      //       RETURNING id, name`,
      //   [user_name, user_email, meal_kind, appointment_remark, date, time],
      //   (err, results) => {
      //     if (err) {
      //       throw err;
      //     }
      //     console.log(results.rows);
      //     res.redirect("/users/summary");
      //   }
      // );

app.get("/users/register", checkAuthenticated, (req, res) => {
  res.render("register.ejs");
});

app.get("/users/login", checkAuthenticated, (req, res) => {
  // flash sets a messages variable. passport sets the error message
  console.log(req.session.flash.error);
  res.render("login.ejs");
});

app.get("/users/summary", checkNotAuthenticated, (req, res) => {
  console.log(req.isAuthenticated());
  res.render("summary", { user: req.user.name, email: req.user.email });
});

app.get("/users/dashboard", checkNotAuthenticated, (req, res) => {
  console.log(req.isAuthenticated());
  res.render("dashboard", { user: req.user.name, email: req.user.email });
});

 app.get("/users/logout", function(req, res) {
  req.logout(function(err){
    if (err) {return next(err); }
    res.render("index", { message: "You have logged out successfully" });
  });
 });

 // successful appointment
 app.get("/users/summary", function(req,res){
  req.logout(function(err){
    if(err) {return next(err);}
    res.render("index", { message: "You have made an appointment succesfully!\nWe will send you the details on email." })
  })
 })

 // Function adds a certain number of days to the specified date.
 function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
// appointment table
app.post("/users/dashboard", async (req, res) => {
  let { user_name, user_email, meal_kind, appointment_remark, date, time } = req.body;

  let errors = [];

  console.log({
    user_name,
    user_email,
    meal_kind,
    appointment_remark,
    date,
    time
  });

  var actual_date = new Date();
  if (date < actual_date.toISOString() || date > addDays(actual_date,90).toISOString()) {
    errors.push({ message: "You can make an appointment on next 90 days only." });
  }

  if (errors.length > 0) {
    res.render("dashboard", { errors, user_name, user_email, meal_kind, appointment_remark, date, time, user: user_name, email: user_email});
  } else {
    // Validation passed
    pool.query(
      `SELECT * FROM appointments
        WHERE email = $1`,
      [user_email],
      (err, results) => {
        if (err) {
          console.log(err);
        }
        console.log(results.rows);
        pool.query(
          `INSERT INTO appointments (name, email, meal_kind, appointment_remark, date, time)
              VALUES ($1, $2, $3, $4, $5, $6)
              RETURNING id, name`,
          [user_name, user_email, meal_kind, appointment_remark, date, time],
          (err, results) => {
            if (err) {
              throw err;
            }
            console.log(results.rows);
            res.redirect("/users/summary");
          }
        );
      }
    );
   }
});

app.post("/users/register", async (req, res) => {
  let { name, email, password, password2 } = req.body;

  let errors = [];

  console.log({
    name,
    email,
    password,
    password2
  });

  if (!name || !email || !password || !password2) {
    errors.push({ message: "Please enter all fields" });
  }

  if (password.length < 6) {
    errors.push({ message: "Password must be a least 6 characters long" });
  }

  if (password !== password2) {
    errors.push({ message: "Passwords do not match" });
  }

  if (errors.length > 0) {
    res.render("register", { errors, name, email, password, password2 });
  } else {
    hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    // Validation passed
    pool.query(
      `SELECT * FROM users
        WHERE email = $1`,
      [email],
      (err, results) => {
        if (err) {
          console.log(err);
        }
        console.log(results.rows);

        if (results.rows.length > 0) {
          return res.render("register", {
            message: "Email already registered"
          });
        } else {
          pool.query(
            `INSERT INTO users (name, email, password)
                VALUES ($1, $2, $3)
                RETURNING id, password`,
            [name, email, hashedPassword],
            (err, results) => {
              if (err) {
                throw err;
              }
              console.log(results.rows);
              req.flash("success_msg", "You are now registered. Please log in");
              res.redirect("/users/login");
            }
          );
        }
      }
    );
  }
});

app.post(
"/users/login",
  passport.authenticate("local", {
    successRedirect: "/users/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true
  })
);

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/dashboard");
  }
  next();
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/users/login");
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
