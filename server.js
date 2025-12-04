// server.js

require("dotenv").config();
const express = require("express");
// [disabled: email verification removed]
// const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(bodyParser.json());
const path = require("path");
const USERS_FILE = path.join(__dirname, "users.json");

// Serve static files from the project root (html, css, js, etc.) so visiting
// http://localhost:3000/sign-up.html serves the signup page.
app.use(express.static(path.join(__dirname, "/")));

// In-memory user storage for demo (replace with a real database)
const users = new Map();

function loadUsersFromDisk() {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
      for (const [email, record] of Object.entries(data)) {
        users.set(email, record);
      }
      console.log(`Loaded ${users.size} users from disk`);
    }
  } catch (e) {
    console.error(
      "Failed to load users from disk:",
      e && e.message ? e.message : e
    );
  }
}

function persistUsersToDisk() {
  try {
    const obj = Object.fromEntries(users);
    fs.writeFileSync(USERS_FILE, JSON.stringify(obj, null, 2));
  } catch (e) {
    console.error(
      "Failed to persist users:",
      e && e.message ? e.message : e
    );
  }
}

// Initialize users from disk at server start
loadUsersFromDisk();

// In-memory code storage for verification and password reset (disabled)
// const verificationCodes = new Map();
// const resetCodes = new Map();

// [new] Simple signup without email verification
app.post("/signup", async (req, res) => {
  const { email, phone, password } = req.body;
  if (!email || !phone || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }
  if (users.has(email)) {
    return res
      .status(400)
      .json({ success: false, message: "User already exists" });
  }
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    users.set(email, { phone, passwordHash });
    persistUsersToDisk();
    return res.json({ success: true });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to create user" });
  }
});

// Login endpoint
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ success: false, message: "Email and password required" });

  const user = users.get(email);
  if (!user)
    return res.status(400).json({ success: false, message: "User not found" });

  const passwordMatch = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatch)
    return res
      .status(400)
      .json({ success: false, message: "Incorrect password" });

  res.json({ success: true, message: "Logged in successfully" });
});

// Reset password endpoint (simple, no code)
app.post("/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) {
    return res
      .status(400)
      .json({ success: false, message: "Email and new password are required" });
  }
  if (!users.has(email)) {
    return res.status(400).json({ success: false, message: "User not found" });
  }
  try {
    const passwordHash = await bcrypt.hash(newPassword, 10);
    users.set(email, { ...users.get(email), passwordHash });
    persistUsersToDisk();
    return res.json({ success: true, message: "Password reset successful" });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to reset password" });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(
    `Serving static files. Open http://localhost:${PORT}/sign-up.html to test the signup form.`
  );
});
