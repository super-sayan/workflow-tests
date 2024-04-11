import { validateLoginForm, validateSignupForm } from '../controllers/validateForm';
const express = require("express");
const router = express.Router();
import { pool } from '../db';
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router
  .route("/login")
  .post(async (req, res) => {
    validateLoginForm(req, res);
    const { email, password } = req.body;
    const user = await pool.query(
      "SELECT id, email, passhash FROM users u WHERE u.email=$1",
      [email]
    );
    if (user.rows.length === 0) {
      return res.json({ loggedIn: false, status: "Wrong email or password!" });
    }
    const validPassword = await bcrypt.compare(password, user.rows[0].passhash);
    if (!validPassword) {
      return res.json({ loggedIn: false, status: "Wrong email or password!" });
    }
    const token = jwt.sign({ email: user.rows[0].email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('refreshToken', token, { httpOnly: true } );
    return res.json({ loggedIn: true, token });
  });

  router
  .route("/signup")
  .post(async (req, res) => {
    validateSignupForm(req, res);
    const { email, name, password } = req.body;
    const userExists = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );
    if (userExists.rows.length > 0) {
      return res.json({ loggedIn: false, status: "User with this email already exists!" });
    }
    const salt = await bcrypt.genSalt(10);
    const passhash = await bcrypt.hash(password, salt);
    await pool.query(
      "INSERT INTO users (email, name, passhash) VALUES ($1, $2, $3)",
      [email, name, passhash]
    );
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('refreshToken', token, { httpOnly: true });
    return res.json({ loggedIn: true, token });
  });

router.get("/logout", (req, res) => {
  res.clearCookie("refreshToken");
  res.clearCookie("connect.sid");
  console.log("Logged out succesfully");
  res.json({ loggedIn: false, message: "Logout successful" });
});

module.exports = router;
