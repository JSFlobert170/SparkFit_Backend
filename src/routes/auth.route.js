const express = require("express");
const router = express.Router();

const registerController = require("../controllers/register.controller");
const loginController = require("../controllers/login.controller");

router.post("/register", registerController.register);
router.post("/login", loginController.login);

module.exports = router;