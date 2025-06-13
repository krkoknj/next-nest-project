// libs/common/src/jwt/constants.ts
export const jwtConstants = {
  accessSecret: process.env.JWT_ACCESS_SECRET || 'access-secret-key123',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh-secret-key123',
  accessExpiresIn: '1m',
  refreshExpiresIn: '7d',
};
