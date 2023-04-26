const express = require("express");
const { validate } = require("express-validation");
const { postValidation } = require("../validations");
const { postController } = require("../controllers");
const auth = require("../middlewares/auth");
const router = express.Router();

router.get("/all", postController.getPosts);
router.get("/my", auth, postController.getMyPosts);
router.get("/user/:id", postController.getPostsByUserId);
router.get("/:id", postController.getPostById);
router.post(
  "/create",
  auth,
  validate(postValidation.createValidation),
  postController.createPost
);
router.patch(
  "/update/:id",
  auth,
  validate(postValidation.updateValidation),
  postController.updateMyPost
);
router.delete("/delete/:id", auth, postController.deleteMyPost);

module.exports = router;
