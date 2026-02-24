import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { config } from '../configs/config.js';
import { ADMIN_ROLE } from './role-constants.js';

const generateStableSeedAdminToken = (userId, extraClaims = {}) => {
  const payload = {
    sub: String(userId),
    role: extraClaims.role || ADMIN_ROLE,
    jti: 'seed-admin-static-jti',
    iat: 1735689600,
    exp: 4102444800,
  };

  return jwt.sign(payload, config.jwt.secret, {
    issuer: config.jwt.issuer,
    audience: config.jwt.audience,
    noTimestamp: true,
  });
};

const decodeFixedSeedAdminToken = (token) => {
  if (!config.seed.fixedToken || token !== config.seed.fixedToken) {
    return null;
  }

  return {
    sub: String(config.seed.admin.id),
    role: ADMIN_ROLE,
  };
};

export const generateJWT = (userId, extraClaims = {}, options = {}) => {
  return new Promise((resolve, reject) => {
    const isSeedAdmin =
      config.seed.stableToken &&
      String(userId) === String(config.seed.admin.id) &&
      (extraClaims.role || ADMIN_ROLE) === ADMIN_ROLE;

    if (isSeedAdmin) {
      if (config.seed.fixedToken) {
        resolve(config.seed.fixedToken);
        return;
      }
      resolve(generateStableSeedAdminToken(userId, extraClaims));
      return;
    }


    const payload = {
      sub: String(userId),
      jti: crypto.randomUUID(),
      iat: Math.floor(Date.now() / 1000),
      ...extraClaims,
    };

    const signOptions = {
      expiresIn: options.expiresIn || config.jwt.expiresIn,
      issuer: config.jwt.issuer,
      audience: config.jwt.audience,
    };

    jwt.sign(payload, config.jwt.secret, signOptions, (err, token) => {
      if (err) {
        console.error('Error generating JWT:', err);
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
};

export const verifyJWT = (token) => {
  return new Promise((resolve, reject) => {
    const decodedFixedToken = decodeFixedSeedAdminToken(token);
    if (decodedFixedToken) {
      resolve(decodedFixedToken);
      return;
    }

    jwt.verify(token, config.jwt.secret, (err, decoded) => {
      if (err) {
        console.error('Error verifying JWT:', err);
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};

export const generateVerificationToken = (userId, type, expiresIn = '24h') => {
  return new Promise((resolve, reject) => {
    const payload = {
      sub: String(userId),
      type: type,
      iat: Math.floor(Date.now() / 1000),
    };

    const signOptions = {
      expiresIn,
      jwtid: crypto.randomUUID(),
      issuer: config.jwt.issuer,
      audience: config.jwt.audience,
    };

    jwt.sign(payload, config.jwt.secret, signOptions, (err, token) => {
      if (err) {
        console.error('Error generating verification token:', err);
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
};

export const verifyVerificationToken = (token) => {
  return verifyJWT(token);
};
