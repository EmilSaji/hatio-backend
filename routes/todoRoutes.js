const express = require("express");
const router = express.Router();

//create todo
router.post("/create", async (req, res) => {
  try {
    const { description, status, projectId } = req.body;
    const created_date = new Date();
    const updated_date = new Date();
    const connection = req.app.locals.connection;
    const [result] = await connection.query(
      "INSERT INTO todo (description, status, created_date, updated_date, project_id) VALUES (?, ?, ?, ?, ?)",
      [description, status, created_date, updated_date, projectId]
    );

    res.json({
      message: "Todo created successfully",
      todoId: result.insertId,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});

//fetch todo based on project id
router.get("/fetch", async (req, res) => {
  try {
    const { projectId } = req.body;
    const connection = req.app.locals.connection;
    const [todos] = await connection.query(
      "SELECT * FROM todo WHERE project_id = ? ORDER BY created_date DESC",
      [projectId]
    );

    if (todos.length === 0) {
      res
        .status(404)
        .json({ message: "No todos found for the given project id" });
    } else {
      res.json({
        message: "Todos fetched successfully",
        todos: todos,
      });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});

//update todo
router.post("/update", async (req, res) => {
  try {
    const { id, description, status } = req.body;
    const updated_date = new Date();
    const connection = req.app.locals.connection;
    const [result] = await connection.query(
      "UPDATE todo SET description = ?, status = ?, updated_date = ? WHERE id = ?",
      [description, status, updated_date, id]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ message: "No todo found with the given id" });
    } else {
      res.json({
        message: "Todo updated successfully",
        affectedRows: result.affectedRows,
      });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});

//delete todo
router.delete("/delete", async (req, res) => {
  try {
    const { id } = req.body;
    const connection = req.app.locals.connection;
    const [result] = await connection.query("DELETE FROM todo WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      res.status(404).json({ message: "No todo found with the given id" });
    } else {
      res.json({
        message: "Todo deleted successfully",
        affectedRows: result.affectedRows,
      });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});

module.exports = router;
