import { body, param, validationResult } from 'express-validator';



export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errors: errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
        value: error.value,
      })),
    });
  }
  next();
};



export const validateRegister = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('El nombre es obligatorio')
    .isLength({ max: 25 })
    .withMessage('El nombre no puede tener más de 25 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El nombre solo puede contener letras y espacios'),

  body('surname')
    .trim()
    .notEmpty()
    .withMessage('El apellido es obligatorio')
    .isLength({ max: 25 })
    .withMessage('El apellido no puede tener más de 25 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El apellido solo puede contener letras y espacios'),

  body('username')
    .trim()
    .notEmpty()
    .withMessage('El nombre de usuario es obligatorio')
    .isLength({ max: 50 })
    .withMessage('El nombre de usuario no puede tener más de 50 caracteres'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('El correo electrónico es obligatorio')
    .isEmail()
    .withMessage('El correo electrónico no tiene un formato válido')
    .isLength({ max: 150 })
    .withMessage('El correo electrónico no puede tener más de 150 caracteres'),

  body('password')
    .notEmpty()
    .withMessage('La contraseña es obligatoria')
    .isLength({ min: 8, max: 255 })
    .withMessage('La contraseña debe tener entre 8 y 255 caracteres'),

  body('phone')
    .notEmpty()
    .withMessage('El número de teléfono es obligatorio')
    .matches(/^\d{8}$/)
    .withMessage('El número de teléfono debe tener exactamente 8 dígitos'),

  handleValidationErrors,
];



export const validateLogin = [
  body('emailOrUsername')
    .trim()
    .notEmpty()
    .withMessage('Email o nombre de usuario es requerido'),

  body('password').notEmpty().withMessage('La contraseña es requerida'),

  handleValidationErrors,
];



export const validateVerifyEmail = [
  body('token').notEmpty().withMessage('El token de verificación es requerido'),

  handleValidationErrors,
];



export const validateResendVerification = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('El email es obligatorio')
    .isEmail()
    .withMessage('Debe proporcionar un email válido'),

  handleValidationErrors,
];



export const validateForgotPassword = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('El email es obligatorio')
    .isEmail()
    .withMessage('Debe proporcionar un email válido'),

  handleValidationErrors,
];



export const validateResetPassword = [
  body('token').notEmpty().withMessage('El token de recuperación es requerido'),

  body('newPassword')
    .notEmpty()
    .withMessage('La nueva contraseña es obligatoria')
    .isLength({ min: 8 })
    .withMessage('La nueva contraseña debe tener al menos 8 caracteres'),

  handleValidationErrors,
];

export const validateUpdateProfile = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 25 })
    .withMessage('El nombre debe tener entre 1 y 25 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El nombre solo puede contener letras y espacios'),

  body('surname')
    .optional()
    .trim()
    .isLength({ min: 1, max: 25 })
    .withMessage('El apellido debe tener entre 1 y 25 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El apellido solo puede contener letras y espacios'),

  body('username')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('El nombre de usuario debe tener entre 1 y 50 caracteres'),

  body('phone')
    .optional()
    .matches(/^\d{8}$/)
    .withMessage('El número de teléfono debe tener exactamente 8 dígitos'),

  handleValidationErrors,
];

export const validateChangePassword = [
  body('currentPassword')
    .notEmpty()
    .withMessage('La contraseña actual es obligatoria'),

  body('newPassword')
    .notEmpty()
    .withMessage('La nueva contraseña es obligatoria')
    .isLength({ min: 8, max: 255 })
    .withMessage('La nueva contraseña debe tener entre 8 y 255 caracteres'),

  handleValidationErrors,
];

export const validateCreatePost = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('El título es obligatorio')
    .isLength({ max: 120 })
    .withMessage('El título no puede exceder 120 caracteres'),

  body('category')
    .trim()
    .notEmpty()
    .withMessage('La categoría es obligatoria')
    .isLength({ max: 60 })
    .withMessage('La categoría no puede exceder 60 caracteres'),

  body('content')
    .trim()
    .notEmpty()
    .withMessage('El contenido es obligatorio')
    .isLength({ max: 5000 })
    .withMessage('El contenido no puede exceder 5000 caracteres'),

  handleValidationErrors,
];

export const validateUpdatePost = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 120 })
    .withMessage('El título debe tener entre 1 y 120 caracteres'),

  body('category')
    .optional()
    .trim()
    .isLength({ min: 1, max: 60 })
    .withMessage('La categoría debe tener entre 1 y 60 caracteres'),

  body('content')
    .optional()
    .trim()
    .isLength({ min: 1, max: 5000 })
    .withMessage('El contenido debe tener entre 1 y 5000 caracteres'),

  handleValidationErrors,
];

export const validateCreateComment = [
  body('postId')
    .trim()
    .notEmpty()
    .withMessage('El postId es obligatorio')
    .isMongoId()
    .withMessage('El postId debe ser un ObjectId válido'),

  body('content')
    .trim()
    .notEmpty()
    .withMessage('El comentario es obligatorio')
    .isLength({ max: 1500 })
    .withMessage('El comentario no puede exceder 1500 caracteres'),

  handleValidationErrors,
];

export const validateUpdateComment = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('El comentario es obligatorio')
    .isLength({ max: 1500 })
    .withMessage('El comentario no puede exceder 1500 caracteres'),

  handleValidationErrors,
];

export const validateMongoIdParam = (paramName) => [
  param(paramName)
    .notEmpty()
    .withMessage(`${paramName} es obligatorio`)
    .isMongoId()
    .withMessage(`${paramName} debe ser un ObjectId válido`),
  handleValidationErrors,
];