'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('payout', {
      url: '/payout',
      template: '<payout></payout>'
    });
}
