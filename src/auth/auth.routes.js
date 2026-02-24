import { Router } from 'express';
import * as authController from './auth.controller.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import {
  authRateLimit,
  requestLimit,
} from '../../middlewares/request-limit.js';
import { upload, handleUploadError } from '../../helpers/file-upload.js';
import {
  validateRegister,
  validateLogin,
  validateVerifyEmail,
  validateResendVerification,
  validateForgotPassword,
  validateResetPassword,
  validateUpdateProfile,
  validateChangePassword,
} from '../../middlewares/validation.js';

const router = Router();



router.post(
  '/register',
  authRateLimit,
  upload.single('profilePicture'),
  handleUploadError,
  validateRegister,
  authController.register
);



router.post('/login', authRateLimit, validateLogin, authController.login);



router.post(
  '/verify-email',
  requestLimit,
  validateVerifyEmail,
  authController.verifyEmail
);



router.post(
  '/resend-verification',
  authRateLimit,
  validateResendVerification,
  authController.resendVerification
);



router.post(
  '/forgot-password',
  authRateLimit,
  validateForgotPassword,
  authController.forgotPassword
);



router.post(
  '/reset-password',
  authRateLimit,
  validateResetPassword,
  authController.resetPassword
);



router.get('/profile', validateJWT, authController.getProfile);



router.post('/profile/by-id', requestLimit, authController.getProfileById);

router.put(
  '/profile',
  validateJWT,
  upload.single('profilePicture'),
  handleUploadError,
  validateUpdateProfile,
  authController.updateProfile
);

router.put(
  '/change-password',
  validateJWT,
  authRateLimit,
  validateChangePassword,
  authController.changePassword
);

export default router;
