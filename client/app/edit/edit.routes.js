'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('linksedit', {
      url: '/links/:uniqueId',
      template: '<edit></edit>',
      authenticate: 'user'
    });
}
