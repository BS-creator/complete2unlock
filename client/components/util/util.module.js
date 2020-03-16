'use strict';

import angular from 'angular';
import {
  UtilService
} from './util.service';

import euroFilter from './euro.filter';

export default angular.module('complete2unlockApp.util', [])
  .factory('Util', UtilService)
  .filter('euro', euroFilter)
  .name;
