import { Post } from './post.model.js';
import { Comment } from '../comments/comment.model.js';
import { asyncHandler } from '../../middlewares/server-genericError-handler.js';

export const createPost = asyncHandler(async (req, res) => {
  const { title, category, content } = req.body;

  const post = await Post.create({
    title,
    category,
    content,
    authorId: req.userId,
    authorUsername: req.user.Username,
  });

  return res.status(201).json({
    success: true,
    message: 'Publicación creada exitosamente',
    data: post,
  });
});

export const getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    data: posts,
  });
});

export const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postId);

  if (!post) {
    return res.status(404).json({
      success: false,
      message: 'Publicación no encontrada',
    });
  }

  return res.status(200).json({
    success: true,
    data: post,
  });
});

export const updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postId);

  if (!post) {
    return res.status(404).json({
      success: false,
      message: 'Publicación no encontrada',
    });
  }

  if (post.authorId !== req.userId) {
    return res.status(403).json({
      success: false,
      message: 'No puedes editar publicaciones de otros usuarios',
    });
  }

  const { title, category, content } = req.body;

  if (typeof title === 'string') {
    post.title = title;
  }
  if (typeof category === 'string') {
    post.category = category;
  }
  if (typeof content === 'string') {
    post.content = content;
  }

  await post.save();

  return res.status(200).json({
    success: true,
    message: 'Publicación actualizada exitosamente',
    data: post,
  });
});

export const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postId);

  if (!post) {
    return res.status(404).json({
      success: false,
      message: 'Publicación no encontrada',
    });
  }

  if (post.authorId !== req.userId) {
    return res.status(403).json({
      success: false,
      message: 'No puedes eliminar publicaciones de otros usuarios',
    });
  }

  await Comment.deleteMany({ postId: post._id });
  await post.deleteOne();

  return res.status(200).json({
    success: true,
    message: 'Publicación eliminada exitosamente',
  });
});
