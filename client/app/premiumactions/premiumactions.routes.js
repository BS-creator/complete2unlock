'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('premiumactions', {
      url: '/premiumactions',
      template: '<premiumactions></premiumactions>',
      authenticate: 'user'
    });
}
