export const logger = require('../config/index.js').getLogger();

export const log = (level, message, meta = {}) => {
  logger.log({
    level,
    msg: message,
    meta,
  });
};