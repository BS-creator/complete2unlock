'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('create', {
      url: '/create',
      template: '<create></create>',
      authenticate: 'user'
    });
}
