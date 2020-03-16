'use strict';

import angular from 'angular';
import SettingsController from './settings.controller';

export default angular.module('complete2unlockApp.settings', [])
  .controller('SettingsController', SettingsController)
  .name;
