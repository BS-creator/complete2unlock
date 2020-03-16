'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('buyactions', {
      url: '/premiumactions/buy',
      template: '<buyactions></buyactions>',
      authenticate: 'user'
    });
}
