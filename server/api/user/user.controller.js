'use strict';

import User from './user.model';
import config from '../../config/environment';
import jwt from 'jsonwebtoken';
const randomstring = require('./randomstring');


const reCAPTCHA = require('recaptcha2');
const recaptcha = new reCAPTCHA({
  siteKey: '6Lcjy2UUAAAAAH23FPexexHjhGzP0ew1AsJolLf_',
  secretKey: '6Lcjy2UUAAAAAPHe98ODDli7su1GurkDCDJrZER0'
})

let emails = {};


const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  pool: true,
  host: 'smtp.sendgrid.net',
  port: 465,
  secure: true, // use TLS
  auth: {
    user: 'apikey',
    pass: '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'
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false
  }
});


function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return function(err) {
    return res.status(statusCode).json(err);
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    return res.status(statusCode).send(err);
  };
}

/**
 * Get list of users
 * restriction: 'admin'
 */
export function index(req, res) {
  return User.find({}, '-salt -password').exec()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(handleError(res));
}

/**
 * Creates a new user
 */
export async function create(req, res) {
  if (emails[req.body.email])
    return res.status(400).json({
      message: 'Email already in use'
    })
  emails[req.body.email] = true;

  let user = await User.findOne({
    email: req.body.email
  });
  if(user)
    return res.status(400).json({
      message: 'Email already in use'
    });
  let newUser = new User({
    email: req.body.email,
    password: req.body.password,
    name: req.body.name
  });
  newUser.provider = 'local';
  newUser.role = 'user';
  if(req.body.affiliateId) {
    let affiliate = await User.findOne({
      affiliateId: req.body.affiliateId
    });
    if(affiliate) {
      affiliate.affiliateStats.users++;
      affiliate.save();
      newUser.referrerId = affiliate.id;
    }
  }
  try {
    user = await newUser.save();
    emails[req.body.email] = undefined;
    var token = jwt.sign({
      _id: user._id
    }, config.secrets.session, {
      expiresIn: 60 * 60 * 5
    });
    res.json({
      token
    });
  } catch(err) {
    console.log(err);
    validationError(res)(err);
  }
}

/**
 * Creates a new user
 */
export function forgotPassword(req, res, next) {
  /*return recaptcha.validate(req.body.token)
    .then(function() {*/
  return User.findOne({
      email: req.body.email
    }).exec()
    .then(user => {
      if (!user) {
        return res.status(404).end(JSON.stringify({
          message: 'user not found'
        }));
      }
      randomstring(15)
        .then((password) => {
          user.password = password;
          user.save();
          transporter.sendMail({
            from: 'Complete2Unlock <team@complete2unlock.com>',
            to: user.email, // list of receivers
            subject: 'Your new password', // Subject line
            html: `<p>Your new password is ${password}</p>` // plain text body
          }, function(err, info) {
            res.status(200).end();
            if (err)
              console.log(err)
            else
              console.log(info);
          });
        })
    })
    .catch(err => next(err));
  /*});*/

}

/**
 * Get a single user
 */
export function show(req, res, next) {
  var userId = req.params.id;

  return User.findById(userId).exec()
    .then(user => {
      if (!user) {
        return res.status(404).end();
      }
      res.json(user.profile);
    })
    .catch(err => next(err));
}

/**
 * Deletes a user
 * restriction: 'admin'
 */
export function destroy(req, res) {
  return User.findByIdAndRemove(req.params.id).exec()
    .then(function() {
      res.status(204).end();
    })
    .catch(handleError(res));
}

/**
 * Change a users password
 */
export function changePassword(req, res) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  return User.findById(userId).exec()
    .then(user => {
      if (user.authenticate(oldPass)) {
        user.password = newPass;
        return user.save()
          .then(() => {
            res.status(204).end();
          })
          .catch(validationError(res));
      } else {
        return res.status(403).end();
      }
    });
}

/**
 * Get my info
 */
export function me(req, res, next) {
  var userId = req.user._id;

  return User.findOne({
      _id: userId
    }, '-salt -password').exec()
    .then(user => { // don't ever give out the password or salt
      if (!user) {
        return res.status(401).end();
      }
      res.json(user);
    })
    .catch(err => next(err));
}

/**
 * Authentication callback
 */
export function authCallback(req, res) {
  res.redirect('/');
}
