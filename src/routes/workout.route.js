const express = require("express");
const router = express.Router({ mergeParams: true });  // Importe les paramètres des parents
const checkJWT = require("../middlewares/checkJWT");
const workoutController = require("../controllers/workout.controller")

// router.get("/:userId/workouts/", checkJWT, workoutController.getUserWorkouts);
router.get("/", workoutController.getWorkouts)
module.exports = router;
