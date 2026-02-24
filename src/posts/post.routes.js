import { Router } from 'express';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import {
  validateCreatePost,
  validateUpdatePost,
  validateMongoIdParam,
} from '../../middlewares/post-validation.js';
import {
  createPost,
  deletePost,
  getPostById,
  getPosts,
  updatePost,
} from './post.controller.js';

const router = Router();

router.get('/', getPosts);
router.get('/:postId', ...validateMongoIdParam('postId'), getPostById);

router.post('/', validateJWT, validateCreatePost, createPost);
router.put(
  '/:postId',
  validateJWT,
  ...validateMongoIdParam('postId'),
  validateUpdatePost,
  updatePost
);
router.delete('/:postId', validateJWT, ...validateMongoIdParam('postId'), deletePost);

export default router;
