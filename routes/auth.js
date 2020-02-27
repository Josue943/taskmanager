const express = require("express");
const authController = require("../controllers/auth");
const router = express.Router();
const { check } = require("express-validator");
const ensureUser = require("../middleware/ensureAuth");

router.post(
  "/register",
  [
    check("name", "Name is required")
      .not()
      .isEmpty(),
    check("email", "Add a valid email").isEmail(),
    check("password", "Password should be at least 6 characters").isLength({
      min: 6
    })
  ],
  authController.register
);
router.post(
  "/login",
  [
    check("email", "Email is required").isEmail(),
    check("password", "Password should be at least 6 characters").isLength({
      min: 6
    })
  ],
  authController.login
);

router.get("/auth", ensureUser, authController.getUser);

module.exports = router;
