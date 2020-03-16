'use strict';

import angular from 'angular';
import LoginController from './login.controller';

export default angular.module('complete2unlockApp.login', [])
  .controller('LoginController', LoginController)
  .name;
