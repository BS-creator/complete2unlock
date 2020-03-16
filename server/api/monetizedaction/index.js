'use strict';

var express = require('express');
var controller = require('./monetizedaction.controller');
import * as auth from '../../auth/auth.service';
var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.post('/', auth.isAuthenticated(), controller.create);
router.get('/complete/:id', auth.isAuthenticated(), controller.completePayment);
//router.get('/:id', auth.isAuthenticated(), controller.show);

//router.put('/:id', auth.isAuthenticated(), controller.upsert);
//router.patch('/:id', auth.isAuthenticated(), controller.patch);
//router.delete('/:id', auth.isAuthenticated(), controller.destroy);

module.exports = router;
