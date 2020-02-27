const Project = require("../models/Project");
const { validationResult } = require("express-validator");

var controller = {
  getProjects: async (req, res) => {
    try {
      const projects = await Project.find({ owner: req.user }).sort({
        create_at: -1
      });
      return res.send(projects);
    } catch (error) {
      return res.status(404).send("unexpected error");
    }
  },
  createProject: async (req, res) => {
    //check errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let project = new Project(req.body);
      project.owner = req.user;
      project.save();
      return res.send(project);
    } catch (error) {
      console.log(error);
      return res.status(500).send("unexpected error");
    }
  },
  updateProject: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const update = req.body;
    try {
      //revisamos que sea el creador
      let project = await Project.findById(req.params.id);
      if (!project) return res.status(404).send("Not found");
      //sin to string no sirve porque es un objeto
      if (update.owner.toString() !== req.user) {
        return res.status(401).send("NOT AUTHORIZED");
      }

      project = await Project.findByIdAndUpdate({ _id: id }, update, {
        new: true
      });
      return res.send(project);
    } catch (error) {
      console.log(error);
      return res.status(500).send("unexpected error");
    }
  },
  deleteProject: async (req, res) => {
    try {
      const project = await Project.findById(req.params.id);
      //check
      if (!project) return res.status(404).send("Not found");
      //sin to string no sirve porque es un objeto
      if (project.owner.toString() !== req.user)
        return res.status(401).send("NOT AUTHORIZED");
      //
      await Project.findOneAndRemove({ _id: req.params.id });
      //
      return res.send("Project Deleted");
    } catch (error) {
      console.log(error);
      return res.status(500).send("unexpected error");
    }
  }
};

module.exports = controller;
