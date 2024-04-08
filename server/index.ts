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
interface CustomRequest extends Request {
    user?: { email: string }; // Define the user property with an optional email string
}
require("dotenv").config();
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: "true",
  },
});
// Function adds a certain number of days to the specified date.
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

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1]; // Extract token after Bearer prefix
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = decoded; // Set decoded user information in req.user
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

app.use("/auth", authRouter);

app.get("/appointments", authenticateJWT, (req: CustomRequest, res) => {
  const email = req.user?.email; // Access user's email from decoded JWT token
  console.log("Received email:", email);
  var actual_date = new Date();
  pool.query(
      `SELECT * FROM appointments WHERE email = $1 AND date > $2 ORDER BY date, time`,
      [email, actual_date.toISOString()],
      (err, results) => {
          if (err) return res.json(err);
          // Send appointments data along with user's email
          res.json({ data: results.rows, email: email });
      }
  );
});

function isValidDate(dateString) {
  const regexDate = /^\d{4}-\d{2}-\d{2}$/;
  return regexDate.test(dateString) && !isNaN(Date.parse(dateString));
}
// Route to create appointments
app.post("/appointments", authenticateJWT, async (req, res) => {
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
// Route to delete appointments
app.delete("/appointments/:id", authenticateJWT, (req: CustomRequest, res) => {
  const { id } = req.params; // You can access the params property
  const email = req.user?.email; // You can also access the user property
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
