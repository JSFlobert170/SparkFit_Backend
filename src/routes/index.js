const express = require("express");
const router = express.Router();

const userRoute = require("./user.route");
const authRoute = require("./auth.route")
const seanceRoute = require("./seance.route")


router.use("/user", userRoute);
router.use("/auth", authRoute);
router.use("/seance", seanceRoute);

module.exports = router;