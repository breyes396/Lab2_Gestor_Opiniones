import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
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
    collection: 'posts',
  }
);

export const Post = mongoose.model('Post', postSchema);
