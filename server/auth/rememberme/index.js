'use strict';

import express from 'express';
import passport from 'passport';
import {
  signToken
} from '../auth.service';


const reCAPTCHA = require('recaptcha2');
const recaptcha = new reCAPTCHA({
  siteKey: '6Lcjy2UUAAAAAH23FPexexHjhGzP0ew1AsJolLf_',
  secretKey: '6Lcjy2UUAAAAAPHe98ODDli7su1GurkDCDJrZER0'
})

var router = express.Router();

router.post('/', function(req, res, next) {
  /*recaptcha.validate(req.body.token)
    .then(function() {*/
  // validated and secure

  passport.authenticate('local', function(err, user, info) {
    var error = err || info;
    if (error) {
      return res.status(401).json(error);
    }
    if (!user) {
      return res.status(404).json({
        message: 'Something went wrong, please try again.'
      });
    }

    var token = signToken(user._id, user.role);
    res.json({
      token
    });
  })(req, res, next);
  /*})
  .catch(function(errorCodes) {
    // invalid
    return res.status(400).json({
      message: recaptcha.translateErrors(errorCodes)[0]
    });
  });*/
});

export default router;
