/**
 * Database configuration
 */

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME || 'rideplatform',
  user: process.env.DB_USER || 'rideplatform',
  password: process.env.DB_PASSWORD || 'password',
  timeout: 5000
};

export const getDBConfig = () => dbConfig;

/**
 * Logger setup
 */

export const getLogger = () => {
  if (process.env.NODE_ENV !== 'production') {
    return require('winston').createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: require('winston-logform').format(),
      transports: [
        new require('winston-logform').transports.Console({
          timeSeriesFormat: true,
        }),
        new require('winston-daily-rotate-file').transports.DailyRotateFile({
          filename: './logs/app.log',
          maxSize: '20m',
          maxFiles: '14d',
        }),
      ],
    });
  }
  return require('winston').createLogger({ level: 'info' });
};