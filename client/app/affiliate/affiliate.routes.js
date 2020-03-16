'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('affiliate', {
      url: '/affiliate',
      template: '<affiliate></affiliate>',
      authenticate: 'user'
    });
}
