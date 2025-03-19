const express = require("express");
const router = express.Router();
const checkJWT = require("../middlewares/checkJWT");
const userController = require("../controllers/user.controller");
const profileController = require("../controllers/profile.controller");

router.get("/", checkJWT, userController.getAllUsers);
router.get("/:id", checkJWT, userController.getUser);
router.put("/:id", checkJWT, userController.updateUser);
router.delete("/:id", checkJWT, userController.deleteUser);
router.get("/self/me", checkJWT, userController.getMe);

// router.get("/:id/profile", profileController.getUserProfile);
// router.put("/:id/profile", profileController.updateUserProfile);



module.exports = router;