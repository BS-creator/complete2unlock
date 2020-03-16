'use strict';

import {Router} from 'express';
import * as controller from './user.controller';
import * as auth from '../../auth/auth.service';



var RateLimit = require('express-rate-limit');

var limiter = new RateLimit({
  windowMs: 5*60*1000, // 15 minutes
  max: 20, // limit each IP to 100 requests per windowMs
  delayMs: 500 // disable delaying - full speed until the max limit is reached
});

var router = new Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', controller.create);
router.use('/forgot', limiter);
router.post('/forgot', controller.forgotPassword);

module.exports = router;
