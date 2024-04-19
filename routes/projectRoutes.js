const express = require("express");
const router = express.Router();

//Create Project
router.post("/create", async (req, res) => {
  try {
    const { title, userId } = req.body;
    const created_date = new Date();
    const connection = req.app.locals.connection;
    const [result] = await connection.query(
      "INSERT INTO project (title, created_date, user_id) VALUES (?, ?, ?)",
      [title, created_date, userId]
    );

    res.json({
      message: "Project created successfully",
      projectId: result.insertId,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});

//Get all projects of the user
router.get("/fetch", async (req, res) => {
  try {
    const { userId } = req.body;
    const connection = req.app.locals.connection;
    const [result] = await connection.query(
      "SELECT * FROM project WHERE user_id = ? ORDER BY created_date DESC",
      [userId]
    );

    res.json({
      message: "Projects fetched successfully",
      projects: result,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});

//Update Project
router.post("/update", async (req, res) => {
  try {
    const { title, projectId } = req.body;
    const connection = req.app.locals.connection;
    const [result] = await connection.query(
      "UPDATE project SET title = ? WHERE id = ?",
      [title, projectId]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Project not found" });
    } else {
      res.json({ message: "Project updated successfully" });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});

//Delete Project
router.delete("/delete", async (req, res) => {
  try {
    const { projectId } = req.body;
    const connection = req.app.locals.connection;
    await connection.query("DELETE FROM project WHERE id = ?", [projectId]);

    res.json({
      message: "Projects deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});

module.exports = router;
