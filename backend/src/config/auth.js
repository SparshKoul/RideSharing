/**
 * Auth configuration
 */

export const getAuthConfig = () => {
  const authConfig = {
    JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  };
  return authConfig;
};