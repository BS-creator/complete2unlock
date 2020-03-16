'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './payout.routes';
import swal from 'sweetalert';

export class PayoutComponent {
  /*@ngInject*/
  constructor(Auth, $http, $state, appConfig) {
    this.Auth = Auth;
    this.$http = $http;
    this.$state = $state;
    this.appConfig = appConfig;
    this.isLoggedIn = Auth.isLoggedInSync;
    Auth.getCurrentUser()
      .then((user) => {
        console.log(user);
        this.currentUser = user;
      })
  }

  requestPayout(paypalEmail) {
    this.$http.post('/api/payouts', {
      paypalEmail: paypalEmail
    }).then(() => swal({
      title: 'Payout successfully requested',
      text: 'We will process your payout in the next 48 hours',
      icon: 'success',
      button: 'Continue'
    }))
    .then(() => this.$state.go('home'))
  }
}

export default angular.module('complete2unlockApp.payout', [uiRouter])
  .config(routes)
  .component('payout', {
    template: require('./payout.html'),
    controller: PayoutComponent,
    controllerAs: '$ctrl'
  })
  .name;
