const User = require("../models/User");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

var controller = {
  register: async (req, res) => {
    //vemos si llegan errores
    const errors = validationResult(req);
    //si hay los returnamos
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) return res.status(400).send("User already exist");

      user = new User(req.body);
      //hash para la contraseña generar
      const salt = await bcryptjs.genSalt(10);
      user.password = await bcryptjs.hash(password, salt);

      await user.save();
      //GENERAR TOKEN
      const payload = {
        id: user._id
      };
      //1 HORA
      jwt.sign(
        payload,
        process.env.SECRET,
        {
          expiresIn: 3600
        },
        (error, token) => {
          if (error) throw error;
          return res.send(token);
        }
      );
    } catch (error) {
      console.log(error);
      return res.status(400).send("unexpected error");
    }
  },
  login: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      //revisamos email
      if (!user) return res.status(400).send("The email doesn`t exist");
      //revisamos password
      const pass = await bcryptjs.compare(password, user.password);
      if (!pass) return res.status(400).send("Incorrect password");
      //GENERAR TOKEN
      const payload = {
        id: user._id
      };
      //1 HORA
      jwt.sign(
        payload,
        process.env.SECRET,
        {
          expiresIn: 3600
        },
        (error, token) => {
          if (error) throw error;
          return res.send(token);
        }
      );
    } catch (error) {
      console.log(error);
    }
  },
  getUser: async (req, res) => {
    try {
      //de esta manera le deccimos los datos que queremos
      const user = await User.findById(req.user).select("-password");
      return res.send(user);
    } catch (error) {
      console.log(error);
      return res.status(500).send("User not found");
    }
  }
};

module.exports = controller;
