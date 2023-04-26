const express = require("express");
const { validate } = require("express-validation");
const { commentValidation } = require("../validations");
const { commentController } = require("../controllers");
const auth = require("../middlewares/auth");
const router = express.Router();

router.get("/:postId", commentController.getCommentsByPostId);
router.post(
  "/create/:postId",
  auth,
  validate(commentValidation.createValidation),
  commentController.createComment
);
router.delete("/delete/:id", auth, commentController.deleteMyComment);

module.exports = router;
