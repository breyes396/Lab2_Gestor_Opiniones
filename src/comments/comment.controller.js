import { Comment } from './comment.model.js';
import { Post } from '../posts/post.model.js';
import { asyncHandler } from '../../middlewares/server-genericError-handler.js';

export const createComment = asyncHandler(async (req, res) => {
  const { postId, content } = req.body;

  const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({
      success: false,
      message: 'No se puede comentar: publicación no encontrada',
    });
  }

  const comment = await Comment.create({
    postId,
    content,
    authorId: req.userId,
    authorUsername: req.user.Username,
  });

  return res.status(201).json({
    success: true,
    message: 'Comentario creado exitosamente',
    data: comment,
  });
});

export const getCommentsByPost = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ postId: req.params.postId }).sort({
    createdAt: -1,
  });

  return res.status(200).json({
    success: true,
    data: comments,
  });
});

export const updateComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.commentId);

  if (!comment) {
    return res.status(404).json({
      success: false,
      message: 'Comentario no encontrado',
    });
  }

  if (comment.authorId !== req.userId) {
    return res.status(403).json({
      success: false,
      message: 'No puedes editar comentarios de otros usuarios',
    });
  }

  comment.content = req.body.content;
  await comment.save();

  return res.status(200).json({
    success: true,
    message: 'Comentario actualizado exitosamente',
    data: comment,
  });
});

export const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.commentId);

  if (!comment) {
    return res.status(404).json({
      success: false,
      message: 'Comentario no encontrado',
    });
  }

  if (comment.authorId !== req.userId) {
    return res.status(403).json({
      success: false,
      message: 'No puedes eliminar comentarios de otros usuarios',
    });
  }

  await comment.deleteOne();

  return res.status(200).json({
    success: true,
    message: 'Comentario eliminado exitosamente',
  });
});
