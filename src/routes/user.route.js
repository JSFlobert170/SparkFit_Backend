const express = require("express");
const router = express.Router();
const checkJWT = require("../middlewares/checkJWT");
const userController = require("../controllers/user.controller");
// const profileController = require("../controllers/profile.controller");
// const userProfileRoute = require("./profile.route");


router.get("/", checkJWT, userController.getAllUsers);
router.get("/:id", checkJWT, userController.getUser);
router.put("/:id", checkJWT, userController.updateUser);
router.delete("/:id", checkJWT, userController.deleteUser);
router.get("/self/me", checkJWT, userController.getMe);

// router.use("/:id/profile", userProfileRoute);

// router.get("/profiles", checkJWT, profileController.getUsersProfile);
// router.post("/:id/profile",checkJWT, profileController.addProfile);

// router.get("/:id/profile",checkJWT, profileController.getUserProfile);
// router.put("/:id/profile", checkJWT, profileController.updateUserProfile);
// router.delete("/:id/profile", checkJWT, profileController.deleteUserProfile);


module.exports = router;