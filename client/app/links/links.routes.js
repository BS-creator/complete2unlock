'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('links', {
      url: '/links',
      template: '<links></links>',
      authenticate: 'user'
    });
}
