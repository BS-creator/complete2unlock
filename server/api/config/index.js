'use strict';

var express = require('express');
var controller = require('./config.controller');
import * as auth from '../../auth/auth.service';
var router = express.Router();

router.get('/', controller.index);
router.get('/latest', controller.latest);
router.post('/', auth.hasRole('admin'), controller.update);

module.exports = router;
