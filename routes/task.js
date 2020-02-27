const express = require("express");
const taskController = require("../controllers/task");
const router = express.Router();
const ensureAuth = require("../middleware/ensureAuth");
const { check } = require("express-validator");

router.post(
  "/task",
  [
    check("name", "Name is required")
      .not()
      .isEmpty()
  ],
  ensureAuth,
  taskController.createdTask
);
//obtener todas las tareas de un proyecto
router.get("/tasks/:id", ensureAuth, taskController.getTasks);
//update task
router.put(
  "/task/:id",
  [
    check("name", "Name is required")
      .not()
      .isEmpty()
  ],
  ensureAuth,
  taskController.updateTask
);

router.delete("/task/:id", ensureAuth, taskController.deleteTask);

module.exports = router;
