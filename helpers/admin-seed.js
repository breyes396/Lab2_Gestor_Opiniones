import { Op } from 'sequelize';
import {
  User,
  UserProfile,
  UserEmail,
  UserPasswordReset,
} from '../src/users/user.model.js';
import { Role, UserRole } from '../src/auth/role.model.js';
import { ADMIN_ROLE } from './role-constants.js';
import { hashPassword } from '../utils/password-utils.js';
import { config } from '../configs/config.js';
import { getDefaultAvatarPath } from './cloudinary-service.js';

const validateSeedAdmin = () => {
  const { admin } = config.seed;
  return (
    admin.name &&
    admin.surname &&
    admin.username &&
    admin.email &&
    admin.password &&
    admin.phone
  );
};

export const seedAdminUser = async () => {
  if (!config.seed.enabled) {
    return null;
  }

  if (!validateSeedAdmin()) {
    console.warn('Seed admin skipped: missing admin env values');
    return null;
  }

  const { admin } = config.seed;
  const username = admin.username.toLowerCase();
  const email = admin.email.toLowerCase();
  const hashedPassword = await hashPassword(admin.password);
  const defaultAvatar = getDefaultAvatarPath();

  const adminRole = await Role.findOne({ where: { Name: ADMIN_ROLE } });
  if (!adminRole) {
    throw new Error('ADMIN_ROLE not found during admin seed');
  }

  return User.sequelize.transaction(async (transaction) => {
    let user = await User.findOne({
      where: {
        [Op.or]: [{ Email: email }, { Username: username }, { Id: admin.id }],
      },
      transaction,
    });

    if (!user) {
      user = await User.create(
        {
          Id: admin.id,
          Name: admin.name,
          Surname: admin.surname,
          Username: username,
          Email: email,
          Password: hashedPassword,
          Status: true,
        },
        { transaction }
      );
    } else {
      await user.update(
        {
          Id: admin.id,
          Name: admin.name,
          Surname: admin.surname,
          Username: username,
          Email: email,
          Password: hashedPassword,
          Status: true,
        },
        { transaction }
      );
    }

    await UserProfile.upsert(
      {
        UserId: admin.id,
        Phone: admin.phone,
        ProfilePicture: defaultAvatar,
      },
      { transaction }
    );

    await UserEmail.upsert(
      {
        UserId: admin.id,
        EmailVerified: true,
        EmailVerificationToken: null,
        EmailVerificationTokenExpiry: null,
      },
      { transaction }
    );

    await UserPasswordReset.upsert(
      {
        UserId: admin.id,
        PasswordResetToken: null,
        PasswordResetTokenExpiry: null,
      },
      { transaction }
    );

    await UserRole.destroy({ where: { UserId: admin.id }, transaction });
    await UserRole.create(
      {
        UserId: admin.id,
        RoleId: adminRole.Id,
      },
      { transaction }
    );

    return admin.id;
  });
};
