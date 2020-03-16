'use strict';

import angular from 'angular';

export default angular.module('complete2unlockApp.constants', [])
  .constant('appConfig', require('../../server/config/environment/shared'))
  .name;
