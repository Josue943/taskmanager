const express = require("express");
const projectController = require("../controllers/project");
const router = express.Router();
const { check } = require("express-validator");
//middleware
const ensureUser = require("../middleware/ensureAuth");

router.post(
  "/project",
  [
    check("name", "Name is required")
      .not()
      .isEmpty()
  ],
  ensureUser,
  projectController.createProject
);
router.get("/projects", ensureUser, projectController.getProjects);
router.put(
  "/project/:id",
  [
    check("name", "Name is required")
      .not()
      .isEmpty()
  ],
  ensureUser,
  projectController.updateProject
);

router.delete("/project/:id", ensureUser, projectController.deleteProject);

module.exports = router;
