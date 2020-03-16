'use strict';

var express = require('express');
var controller = require('./payout.controller');
import * as auth from '../../auth/auth.service';

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
//router.get('/:id', controller.show);
router.post('/', auth.isAuthenticated(), controller.create);

router.get('/admin', auth.hasRole('admin'), controller.indexAdmin);
router.post('/admin/:id', auth.hasRole('admin'), controller.completeAdmin);

//router.put('/:id', controller.upsert);
//router.patch('/:id', controller.patch);
//router.delete('/:id', controller.destroy);

module.exports = router;
