const Task = require("../models/Task");
const Project = require("../models/Project");
const { validationResult } = require("express-validator");

var controller = {
  createdTask: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      //revisamos si el projecto existe
      const { projectId } = req.body;
      const project = await Project.findById(projectId);
      if (!project) return res.status(404).send("Project not found");
      //ver si el usuario es el dueño del proyecto
      if (project.owner.toString() !== req.user)
        return res.status(401).send("NOT AUTHORIZED");
      //
      const task = new Task(req.body);
      await task.save();
      return res.send(task);
    } catch (error) {
      console.log(error);
      return res.status(500).send("unexpected error");
    }
  },

  getTasks: async (req, res) => {
    try {
      //check project
      const project = await Project.findById(req.params.id);
      if (project.owner.toString() !== req.user)
        return res.status(401).send("NOT AUTHORIZED");
      //check task
      const tasks = await Task.find({ projectId: req.params.id });
      return res.send(tasks);
    } catch (error) {
      console.log(error);
      return res.status(500).send("unexpected error");
    }
  },
  updateTask: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { projectId } = req.body;
      //check project
      const project = await Project.findById(projectId);
      //check user
      if (project.owner.toString() !== req.user)
        return res.status(401).send("NOT AUTHORIZED");
      //task
      let task = await Task.findById(req.params.id);
      if (!task) return res.status(404).send("Task not found");
      task = await Task.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true
      });
      return res.send(task);
    } catch (error) {
      console.log(error);
      return res.status(500).send("unexpected error");
    }
  },

  deleteTask: async (req, res) => {
    try {
      //task
      let task = await Task.findById(req.params.id);
      if (!task) return res.status(404).send("Task not found");
      //user
      let project = await Project.findById(task.projectId);
      if (project.owner.toString() !== req.user)
        return res.status(401).send("NOT AUTHORIZED");
      await Task.findOneAndRemove({ _id: req.params.id });
      return res.send("TASK DELETED");
    } catch (error) {
      console.log(error);
      return res.status(500).send("unexpected error");
    }
  }
};

module.exports = controller;
