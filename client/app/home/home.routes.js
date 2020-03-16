'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('home', {
      url: '/home',
      template: '<home></home>',
      authenticate: 'user'
    });
}
