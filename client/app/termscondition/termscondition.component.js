'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './termscondition.routes';

export class TermsconditionComponent {
  /*@ngInject*/
  constructor(Auth) {
    this.isLoggedIn = Auth.isLoggedInSync;
    this.message = 'Hello';
  }
}

export default angular.module('complete2unlockApp.termscondition', [uiRouter])
  .config(routes)
  .component('termscondition', {
    template: require('./termscondition.html'),
    controller: TermsconditionComponent,
    controllerAs: '$ctrl'
  })
  .name;
