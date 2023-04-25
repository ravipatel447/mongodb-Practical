const express = require("express");
const { validate } = require("express-validation");
const { userValidation } = require("../validations");
const { userController } = require("../controllers");
const auth = require("../middlewares/auth");
const router = express.Router();

router.get("/me", auth, userController.getUserProfile);

router.patch(
  "/me",
  auth,
  validate(userValidation.updateValidation),
  userController.updateUserProfile
);

router.delete("/me", auth, userController.deleteUserProfile);

module.exports = router;
