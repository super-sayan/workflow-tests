import express = require("express");
const { Server } = require("socket.io");
const app = express();
const helmet = require("helmet");
const cors = require("cors");
const authRouter = require("./routers/authRouter");
const session = require("express-session");
const server = require("http").createServer(app);
import {pool} from './db';
import {validatePostForm} from './controllers/validateForm';
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
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    credentials: true,
    name: "sid",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.ENVIRONMENT === "production" ? "true" : "auto",
      httpOnly: true,
      expires: 1000 * 60 * 60 * 24 * 7,
      sameSite: process.env.ENVIRONMENT === "production" ? "none" : "lax",
    },
  })
);
app.use("/auth", authRouter);

app.get("/appointments", (req, res) => {
  const email = req.headers["user-email"];
  console.log("Received email:", email); 
  var actual_date = new Date();
  pool.query(
    `SELECT * FROM appointments WHERE email = $1 AND date > $2 ORDER BY date, time`,
    [email, actual_date.toISOString()],
    (err, results) => {
      if (err) return res.json(err);
      return res.json(results.rows);
    }
  );
});

function isValidDate(dateString) {
  const regexDate = /^\d{4}-\d{2}-\d{2}$/;
  return regexDate.test(dateString) && !isNaN(Date.parse(dateString));
}

app.post("/appointments", async (req, res) => {
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

// Delete functionality
app.delete("/appointments/:id", (req, res) => {
  const { id } = req.params;
  pool.query(
    `DELETE FROM appointments WHERE id = $1`,
    [id],
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
