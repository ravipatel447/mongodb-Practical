const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      require: true,
      trim: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "Post",
    },
    commentedBy: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
