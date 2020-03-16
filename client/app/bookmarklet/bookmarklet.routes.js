'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('bookmarklet', {
      url: '/bookmarklet',
      template: '<bookmarklet></bookmarklet>',
      authenticate: 'user'
    });
}
