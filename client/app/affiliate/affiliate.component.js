'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './affiliate.routes';

export class AffiliateComponent {
  /*@ngInject*/
  constructor(Auth) {
    this.getCurrentUser = Auth.getCurrentUserSync;
  }

  getFreeActions() {
    if(!this.getCurrentUser().affiliateStats)
      return 0;
    return Math.floor((this.getCurrentUser().affiliateStats.completions - this.getCurrentUser().affiliateStats.completionsPayout) * 0.1 / 500) * 500;
  }
}

export default angular.module('complete2unlockApp.affiliate', [uiRouter])
  .config(routes)
  .component('affiliate', {
    template: require('./affiliate.html'),
    controller: AffiliateComponent,
    controllerAs: '$ctrl'
  })
  .name;
