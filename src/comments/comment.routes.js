import { Router } from 'express';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import {
  validateCreateComment,
  validateUpdateComment,
  validateMongoIdParam,
} from '../../middlewares/comment-validation.js';
import {
  createComment,
  deleteComment,
  getCommentsByPost,
  updateComment,
} from './comment.controller.js';

const router = Router();

router.get('/post/:postId', ...validateMongoIdParam('postId'), getCommentsByPost);

router.post('/', validateJWT, validateCreateComment, createComment);
router.put(
  '/:commentId',
  validateJWT,
  ...validateMongoIdParam('commentId'),
  validateUpdateComment,
  updateComment
);
router.delete(
  '/:commentId',
  validateJWT,
  ...validateMongoIdParam('commentId'),
  deleteComment
);

export default router;
