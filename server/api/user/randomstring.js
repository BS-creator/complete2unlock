const crypto = require('crypto');

module.exports = function(length) {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(length, (err, buf) => {
      if (err)
        return reject();
      resolve(buf.toString('base64').replace(/\//g, '').replace(/\+/g, '').replace(/=/g, ''));
    });
  });
}
