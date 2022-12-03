const limiter = require('express-rate-limit');

module.exports = limiter({
  WindowsMs: 300000,
  max: 100,
});
