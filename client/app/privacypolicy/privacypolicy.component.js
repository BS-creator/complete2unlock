'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './privacypolicy.routes';

export class PrivacypolicyComponent {
  /*@ngInject*/
  constructor(Auth) {
    this.isLoggedIn = Auth.isLoggedInSync;
    this.message = 'Hello';
  }
}

export default angular.module('complete2unlockApp.privacypolicy', [uiRouter])
  .config(routes)
  .component('privacypolicy', {
    template: require('./privacypolicy.html'),
    controller: PrivacypolicyComponent,
    controllerAs: '$ctrl'
  })
  .name;
