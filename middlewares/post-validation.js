import { body } from 'express-validator';
import {
  handleValidationErrors,
  validateMongoIdParam,
} from './validation.js';

export const validateCreatePost = [
  body('title')
    .exists({ checkFalsy: true })
    .withMessage('El título es obligatorio')
    .bail()
    .isString()
    .withMessage('El título debe ser texto')
    .bail()
    .trim()
    .isLength({ min: 1, max: 120 })
    .withMessage('El título debe tener entre 1 y 120 caracteres'),

  body('category')
    .exists({ checkFalsy: true })
    .withMessage('La categoría es obligatoria')
    .bail()
    .isString()
    .withMessage('La categoría debe ser texto')
    .bail()
    .trim()
    .isLength({ min: 1, max: 60 })
    .withMessage('La categoría debe tener entre 1 y 60 caracteres'),

  body('content')
    .exists({ checkFalsy: true })
    .withMessage('El contenido es obligatorio')
    .bail()
    .isString()
    .withMessage('El contenido debe ser texto')
    .bail()
    .trim()
    .isLength({ min: 1, max: 5000 })
    .withMessage('El contenido debe tener entre 1 y 5000 caracteres'),

  handleValidationErrors,
];

export const validateUpdatePost = [
  body('title')
    .optional()
    .isString()
    .withMessage('El título debe ser texto')
    .bail()
    .trim()
    .notEmpty()
    .withMessage('El título no puede estar vacío')
    .bail()
    .isLength({ min: 1, max: 120 })
    .withMessage('El título debe tener entre 1 y 120 caracteres'),

  body('category')
    .optional()
    .isString()
    .withMessage('La categoría debe ser texto')
    .bail()
    .trim()
    .notEmpty()
    .withMessage('La categoría no puede estar vacía')
    .bail()
    .isLength({ min: 1, max: 60 })
    .withMessage('La categoría debe tener entre 1 y 60 caracteres'),

  body('content')
    .optional()
    .isString()
    .withMessage('El contenido debe ser texto')
    .bail()
    .trim()
    .notEmpty()
    .withMessage('El contenido no puede estar vacío')
    .bail()
    .isLength({ min: 1, max: 5000 })
    .withMessage('El contenido debe tener entre 1 y 5000 caracteres'),

  body().custom((_, { req }) => {
    const hasAnyField = ['title', 'category', 'content'].some((field) =>
      Object.prototype.hasOwnProperty.call(req.body, field)
    );

    if (!hasAnyField) {
      throw new Error(
        'Debes enviar al menos uno de estos campos: title, category, content'
      );
    }

    return true;
  }),

  handleValidationErrors,
];

export { validateMongoIdParam };
