import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1500,
    },
    authorId: {
      type: String,
      required: true,
      index: true,
    },
    authorUsername: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: 'comments',
  }
);

export const Comment = mongoose.model('Comment', commentSchema);
