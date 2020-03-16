'use strict';

var express = require('express');
var controller = require('./link.controller');
import * as auth from '../../auth/auth.service';

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.get('/unlock/:uniqueId', controller.unlock);
router.get('/unlock/:uniqueId/:action', controller.unlockAction);
//router.get('/complete/:uniqueId', controller.complete);
router.post('/complete/:uniqueId', controller.completePost);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.upsert);
router.patch('/:id', auth.isAuthenticated(), controller.patch);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);

module.exports = router;
