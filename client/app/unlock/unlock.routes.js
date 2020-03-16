'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
  .state('unlock', {
    url: '/:uniqueId',
    template: '<unlock></unlock>'
  })
  .state('unlockembed', {
    url: '/embed/:uniqueId',
    template: '<unlock></unlock>'
  });
}
