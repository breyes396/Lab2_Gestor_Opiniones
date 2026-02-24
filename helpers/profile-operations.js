import { findUserById } from './user-db.js';
import { buildUserResponse } from '../utils/user-helpers.js';
import {
  findUserByUsername,
  updateUserProfileData,
  updateUserPassword,
} from './user-db.js';
import { verifyPassword, hashPassword } from '../utils/password-utils.js';

export const getUserProfileHelper = async (userId) => {
  const user = await findUserById(userId);
  if (!user) {
    const err = new Error('Usuario no encontrado');
    err.status = 404;
    throw err;
  }
  return buildUserResponse(user);
};

export const updateUserProfileHelper = async (userId, updateData) => {
  const currentUser = await findUserById(userId);
  if (!currentUser) {
    const err = new Error('Usuario no encontrado');
    err.status = 404;
    throw err;
  }

  if (updateData.username) {
    const foundByUsername = await findUserByUsername(updateData.username);
    if (foundByUsername && foundByUsername.Id !== userId) {
      const err = new Error('El nombre de usuario ya está en uso');
      err.status = 409;
      throw err;
    }
  }

  const updated = await updateUserProfileData(userId, updateData);
  return buildUserResponse(updated);
};

export const changePasswordHelper = async (
  userId,
  currentPassword,
  newPassword
) => {
  const currentUser = await findUserById(userId);
  if (!currentUser) {
    const err = new Error('Usuario no encontrado');
    err.status = 404;
    throw err;
  }

  const isCurrentPasswordValid = await verifyPassword(
    currentUser.Password,
    currentPassword
  );

  if (!isCurrentPasswordValid) {
    const err = new Error('La contraseña actual es incorrecta');
    err.status = 401;
    throw err;
  }

  const newHashedPassword = await hashPassword(newPassword);
  await updateUserPassword(userId, newHashedPassword);

  return {
    success: true,
    message: 'Contraseña actualizada correctamente',
  };
};