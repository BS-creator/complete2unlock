'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('privacypolicy', {
      url: '/privacypolicy',
      template: '<privacypolicy></privacypolicy>'
    });
}
