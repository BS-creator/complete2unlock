'use strict';
/*eslint no-invalid-this:0*/
import crypto from 'crypto';
mongoose.Promise = require('bluebird');
import mongoose, {
  Schema
} from 'mongoose';
import {
  registerEvents
} from './user.events';
const bcrypt = require('bcrypt');
const saltRounds = 10;

const authTypes = ['github', 'twitter', 'facebook', 'google'];
const randomstring = require('./randomstring');
import request from 'request';
async function shortenUrl(serviceUrl, longUrl) {
  let response = await new Promise(resolve => {
    request(`${serviceUrl}/api?url=${longUrl}`, {json: true}, (error, response, body) => {
      if(error)
        return resolve();
      resolve(body);
    });
  });
  return response.short;
}

var UserSchema = new Schema({
  name: String,
  email: {
    type: String,
    lowercase: true,
    required() {
      if (authTypes.indexOf(this.provider) === -1) {
        return true;
      } else {
        return false;
      }
    }
  },
  referrerId: {
    type: String,
  },
  affiliateId: {
    type: String,
    lowercase: true
  },
  affiliateUrl: {
    type: String,
    lowercase: true
  },
  affiliateStats: {
    users: {
      type: Number,
      default: 0
    },
    views: {
      type: Number,
      default: 0
    },
    completions: {
      type: Number,
      default: 0
    },
    completionsPayout: {
      type: Number,
      default: 0
    }
  },
  role: {
    type: String,
    default: 'user'
  },
  password: {
    type: String,
    required() {
      if(authTypes.indexOf(this.provider) === -1) {
        return true;
      } else {
        return false;
      }
    }
  },
  createDate: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  blockMonetized: Boolean,
  creditPending: {
    type: Number,
    default: 0
  },
  creditPaid: {
    type: Number,
    default: 0
  },
  imported: Boolean,
  provider: String,
  salt: String,
  oldId: Number,
  facebook: {},
  twitter: {},
  google: {},
  github: {},
  completionCountries: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
});

/**
 * Virtuals
 */

// Public profile information
UserSchema
  .virtual('profile')
  .get(function() {
    return {
      name: this.name,
      role: this.role
    };
  });

// Non-sensitive info we'll be putting in the token
UserSchema
  .virtual('token')
  .get(function() {
    return {
      _id: this._id,
      role: this.role
    };
  });

/**
 * Validations
 */

// Validate empty email
UserSchema
  .path('email')
  .validate(function(email) {
    if (authTypes.indexOf(this.provider) !== -1) {
      return true;
    }
    return email.length;
  }, 'Email cannot be blank');

// Validate empty password
UserSchema
  .path('password')
  .validate(function(password) {
    if (authTypes.indexOf(this.provider) !== -1) {
      return true;
    }
    return password.length;
  }, 'Password cannot be blank');

// Validate email is not taken
UserSchema
  .path('email')
  .validate(function(value) {
    if (authTypes.indexOf(this.provider) !== -1) {
      return true;
    }

    return this.constructor.findOne({
      email: value
    }).exec()
      .then(user => {
        if (user) {
          if (this.id === user.id) {
            return true;
          }
          return false;
        }
        return true;
      })
      .catch(function(err) {
        throw err;
      });
  }, 'The specified email address is already in use.');

UserSchema
  .path('affiliateId')
  .validate(function(value) {
    return this.constructor.findOne({
      affiliateId: value
    }).exec()
      .then(user => !user || this.id === user.id)
      .catch(function(err) {
        throw err;
      });
  }, 'The specified affilate tag is already in use.');

var validatePresenceOf = function(value) {
  return value && value.length;
};

/**
 * Pre-save hook
 */
UserSchema
  .pre('save', function(next) {
    if(this.affiliateId)
      return next();
    randomstring(10)
      .then((affiliateId) => {
        this.affiliateId = affiliateId;
        next();
      });
  });

UserSchema
  .pre('save', function(next) {
    // Handle new/update passwords
    if (!this.isModified('password')) {
      return next();
    }

    if (this.imported)
      return next();



    if (!validatePresenceOf(this.password)) {
      if (authTypes.indexOf(this.provider) === -1) {
        return next(new Error('Invalid password'));
      } else {
        return next();
      }
    }

    // Make salt with a callback
    this.encryptPassword(this.password, (encryptErr, hashedPassword) => {
      if (encryptErr) {
        return next(encryptErr);
      }
      this.password = hashedPassword;
      return next();
    });
  });

UserSchema.pre('save', function(next) {
  if (this.affiliateUrl)
    return next();
  shortenUrl('https://getthelink.xyz', `https://complete2unlock.com/?aff=${this.affiliateId}`)
    .then(shortUrl => {
      console.log(shortUrl);
      this.affiliateUrl = shortUrl;
    })
    .then(() => next());
});

/**
 * Methods
 */
UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} password
   * @param {Function} callback
   * @return {Boolean}
   * @api public
   */
  authenticate(password, callback) {
    if (!callback) {
      return false;
      //return this.password === this.encryptPassword(password);
    }

    bcrypt.compare(password, (this.password || '').split('$2y').join('$2a'), function(err, res) {
      if (err) {
        return callback(err);
      }
      callback(null, res);
      // res == true
    });

    /*this.encryptPassword(password, (err, pwdGen) => {
      if(err) {
        return callback(err);
      }

      if(this.password === pwdGen) {
        return callback(null, true);
      } else {
        return callback(null, false);
      }
    });*/
  },

  /**
   * Make salt
   *
   * @param {Number} [byteSize] - Optional salt byte size, default to 16
   * @param {Function} callback
   * @return {String}
   * @api public
   */
  makeSalt(...args) {
    let byteSize;
    let callback;
    let defaultByteSize = 16;

    if (typeof args[0] === 'function') {
      callback = args[0];
      byteSize = defaultByteSize;
    } else if (typeof args[1] === 'function') {
      callback = args[1];
    } else {
      throw new Error('Missing Callback');
    }

    if (!byteSize) {
      byteSize = defaultByteSize;
    }

    return crypto.randomBytes(byteSize, (err, salt) => {
      if (err) {
        return callback(err);
      } else {
        return callback(null, salt.toString('base64'));
      }
    });
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @param {Function} callback
   * @return {String}
   * @api public
   */
  encryptPassword(password, callback) {
    if (!password) {
      if (!callback) {
        return null;
      } else {
        return callback('Missing password or salt');
      }
    }

    bcrypt.hash(password, saltRounds, function(err, hash) {
      if (err) {
        return callback(err);
      } else {
        return callback(null, hash);
      }
    });

    /*var defaultIterations = 10000;
    var defaultKeyLength = 64;
    var salt = new Buffer(this.salt, 'base64');

    if (!callback) {
      // eslint-disable-next-line no-sync
      return crypto.pbkdf2Sync(password, salt, defaultIterations,
          defaultKeyLength, 'sha1')
        .toString('base64');
    }

    return crypto.pbkdf2(password, salt, defaultIterations, defaultKeyLength, 'sha1', (err, key) => {
      if (err) {
        return callback(err);
      } else {
        return callback(null, key.toString('base64'));
      }
    });*/
  }
};

registerEvents(UserSchema);
export default mongoose.model('User', UserSchema);
