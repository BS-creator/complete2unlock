import crypto from "crypto";
import Token from '../../api/user/token.model';

function generateRandomtoken() {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(64, function(err, buffer) {
      if(err)
        reject(err);
      var token = buffer.toString('base64');
      resolve(token);
    });
  });
}

export default function issue(user, done) {
  generateRandomtoken()
    .then(token => {
      let t = new Token({
        user: user.id,
        token
      });
      t.save();
      done(null, token);
    });
}
