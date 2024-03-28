import {validateLoginForm, validateSignupForm} from '../controllers/validateForm';
const express = require("express");
const router = express.Router();
import {pool} from '../db';
const bcrypt = require("bcrypt");

router
  .route("/login")
  .get(async (req, res) => {
    if (req.session.user && req.session.user.email) {
      res.json({ loggedIn: true, email: req.session.user.email });
    } else {
      res.json({ loggedIn: false });
    }
  })
  .post(async (req, res) => {
    validateLoginForm(req, res);

    const potentialLogin = await pool.query(
      "SELECT id, email, passhash FROM users u WHERE u.email=$1",
      [req.body.email]
    );

    if (potentialLogin.rowCount > 0) {
      const isSamePass = await bcrypt.compare(
        req.body.password,
        potentialLogin.rows[0].passhash
      );
      if (isSamePass) {
        req.session.user = {
          email: req.body.email,
          id: potentialLogin.rows[0].id,
        };
        res.json({ loggedIn: true, email: req.body.email });
      } else {
        res.json({ loggedIn: false, status: "Wrong email or password!" });
        console.log("not good");
      }
    } else {
      console.log("not good");
      res.json({ loggedIn: false, status: "Wrong email or password!" });
    }
  });

router.route("/logout").get(async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).json({ message: "Failed to log out" });
    }
    res.status(200).json({ message: "Logged out successfully", loggedIn: false });
  });
});

router.post("/signup", async (req, res) => {
  try {
    validateSignupForm(req, res);

    const existingUser = await pool.query(
      "SELECT email from users WHERE email=$1",
      [req.body.email]
    );

    // Check if passwords match
    const passwordsMatch = req.body.password === req.body.password2;

    if (!passwordsMatch) {
      return res.json({ loggedIn: false, status: "Passwords do not match" });
    }

    if (existingUser.rowCount === 0) {
      // Register new user
      const hashedPass = await bcrypt.hash(req.body.password, 10);
      const newUserQuery = await pool.query(
        "INSERT INTO users(email, name, passhash) values($1,$2,$3) RETURNING id, email",
        [req.body.email, req.body.name, hashedPass]
      );
      req.session.user = {
        email: req.body.email,
        id: newUserQuery.rows[0].id,
      };
      return res.json({ loggedIn: true, email: req.body.email });
    } else {
      return res.json({ loggedIn: false, status: "Email is taken" });
    }
  } catch (error) {
    console.error("Error in signup route:", error);
    return res.status(500).json({ loggedIn: false, status: "Internal Server Error" });
  }
});

module.exports = router;
