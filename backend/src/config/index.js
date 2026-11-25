/**
 * Supabase configuration
 */

import { createClient } from '@supabase/supabase-js';
import winston from 'winston';

export const getSupabaseClient = () => {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );
};

/**
 * Logger setup
 */

export const getLogger = () => {
  if (process.env.NODE_ENV !== 'production') {
    return winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        new winston.transports.Console({
          timeSeriesFormat: true,
        }),
        new winston.transports.File({
          filename: './logs/app.log',
          maxsize: '20m',
          maxFiles: '14d',
        }),
      ],
    });
  }
  return winston.createLogger({ level: 'info' });
};