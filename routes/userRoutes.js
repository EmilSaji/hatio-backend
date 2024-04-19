const express = require("express");
const bcrypt = require("bcrypt");

const router = express.Router();

//Create User
router.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const connection = req.app.locals.connection;
    const [result] = await connection.query(
      "INSERT INTO user (username, password) VALUES (?, ?)",
      [username, hashedPassword]
    );

    res.json({ message: "User created successfully", userId: result.insertId });
  } catch (err) {
    if ((err.code = "ER_DUP_ENTRY")) {
      res.status(500).json({ message: "Username Already Exists!!" });
    } else {
      res.status(500).json({ message: "Server error", error: err });
    }
  }
});

//Login
router.get("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const connection = req.app.locals.connection;
    const [rows] = await connection.query(
      "SELECT * FROM user WHERE username = ?",
      [username]
    );

    if (rows.length > 0) {
      const user = rows[0];
      const match = await bcrypt.compare(password, user.password);

      if (match) {
        const userWithoutPassword = { id: user.id, username: user.username };
        res.json({
          message: "Login successful",
          userWithoutPassword: userWithoutPassword,
        });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
