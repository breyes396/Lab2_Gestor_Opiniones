import { body } from 'express-validator';
import {
  handleValidationErrors,
  validateMongoIdParam,
} from './validation.js';

export const validateCreateComment = [
  body('postId')
    .exists({ checkFalsy: true })
    .withMessage('El postId es obligatorio')
    .bail()
    .isMongoId()
    .withMessage('El postId debe ser un ObjectId valido'),

  body('content')
    .exists({ checkFalsy: true })
    .withMessage('El comentario es obligatorio')
    .bail()
    .isString()
    .withMessage('El comentario debe ser texto')
    .bail()
    .trim()
    .isLength({ min: 1, max: 1500 })
    .withMessage('El comentario debe tener entre 1 y 1500 caracteres'),

  handleValidationErrors,
];

export const validateUpdateComment = [
  body('content')
    .exists({ checkFalsy: true })
    .withMessage('El comentario es obligatorio')
    .bail()
    .isString()
    .withMessage('El comentario debe ser texto')
    .bail()
    .trim()
    .isLength({ min: 1, max: 1500 })
    .withMessage('El comentario debe tener entre 1 y 1500 caracteres'),

  handleValidationErrors,
];

export { validateMongoIdParam };
