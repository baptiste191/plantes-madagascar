// backend/src/utils/logger.js
module.exports = {
    info:  (...args) => console.log('[INFO]', ...args),
    error: (...args) => console.error('[ERROR]', ...args)
  };
  