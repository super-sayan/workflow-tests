import express = require("express");
import jwt = require("jsonwebtoken");
const { Server } = require("socket.io");
const app = express();
const helmet = require("helmet");
const server = require("http").createServer(app);
const cors = require("cors");
const authRouter = require("./routers/authRouter");
import { pool } from './db';
import { validatePostForm } from './controllers/validateForm';
import { Request } from 'express';
import { verifyToken } from './routers/verifyToken';
const cookieParser = require('cookie-parser');

app.use(cookieParser());

interface CustomRequest extends Request {
    user?: { email: string };
}

require("dotenv").config();
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true, 
  },
});

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use("/auth", authRouter);

app.get("/appointments", verifyToken, (req: CustomRequest, res) => {
  const email = req.user?.email;
  var actual_date = new Date();
  pool.query(
    `SELECT * FROM appointments WHERE email = $1 AND date > $2 ORDER BY date, time`,
    [email, actual_date.toISOString()],
    (err, results) => {
      if (err) return res.json(err);
      res.json({ data: results.rows, email: email });
    }
  );
});

function isValidDate(dateString) {
  const regexDate = /^\d{4}-\d{2}-\d{2}$/;
  return regexDate.test(dateString) && !isNaN(Date.parse(dateString));
}

app.post("/appointments", verifyToken, async (req, res) => {
  let { email, name, meal_kind, date, time, appointment_remark } = req.body;
  try {
    validatePostForm(req, res);
    var actual_date = new Date();
    if (!isValidDate(date) || date < actual_date.toISOString() || date > addDays(actual_date, 90).toISOString()) {
      return res.status(400).json({ status: "Invalid or out-of-range date" });
    }
    await pool.query(
      `INSERT INTO appointments(email, name, meal_kind, date, time, appointment_remark)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, name`,
      [email, name, meal_kind, date, time, appointment_remark]
    );
    return res.json(true);
  } catch (error) {
    console.error("Error creating appointment:", error);
    return res.status(500).json(false);
  }
});

app.delete("/appointments/:id", verifyToken, (req: CustomRequest, res) => {
  const { id } = req.params;
  const email = req.user?.email;
  pool.query(
      `DELETE FROM appointments WHERE id = $1 AND email = $2`,
      [id, email],
      (err, results) => {
          if (err) return res.status(500).json({ error: "Failed to delete appointment" });
          return res.json({ message: "Appointment deleted successfully" });
      }
  );
});

io.on("connect", socket => {});
server.listen(4000, () => {
  console.log("Server listening on port 4000");
});
