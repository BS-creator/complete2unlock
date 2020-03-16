'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './premiumactions.routes';

export class PremiumactionsComponent {
  /*@ngInject*/
  constructor($http) {
    this.$http = $http;
    this.reloadMonetizedActions();
  }

  reloadMonetizedActions() {
    return this.$http.get('/api/monetizedactions')
      .then((response) => {
        this.monetizedactions = response.data;
      });
  }
}

export default angular.module('complete2unlockApp.premiumactions', [uiRouter])
  .config(routes)
  .component('premiumactions', {
    template: require('./premiumactions.html'),
    controller: PremiumactionsComponent,
    controllerAs: '$ctrl'
  })
  .name;
