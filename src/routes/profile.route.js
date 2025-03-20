const express = require("express");
const router = express.Router({ mergeParams: true });  // Importe les paramètres des parents
const checkJWT = require("../middlewares/checkJWT");
const profileController = require("../controllers/profile.controller");

// router.get("/profiles", checkJWT, profileController.getUsersProfile);
// router.post("/:id/profile",checkJWT, profileController.addProfile);
// router.delete("/", checkJWT, profileController.deleteUserProfile);

router.get("/",checkJWT, profileController.getUserProfile);
router.put("/", checkJWT, profileController.updateUserProfile);

module.exports = router;