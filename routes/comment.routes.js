const express = require("express");
const { validate } = require("express-validation");
const { commentValidation } = require("../validations");
const { commentController } = require("../controllers");
const auth = require("../middlewares/auth");
const optionalAuth = require("../middlewares/optionalAuth");
const router = express.Router();

router.get("/:postId", optionalAuth, commentController.getCommentsByPostId);
router.post(
  "/create/:postId",
  auth,
  validate(commentValidation.createValidation),
  commentController.createComment
);
router.patch("/update/:commentId", auth, commentController.updateCommentById);
router.delete("/delete/:id", auth, commentController.deleteMyComment);

module.exports = router;
