'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('termscondition', {
      url: '/termscondition',
      template: '<termscondition></termscondition>'
    });
}
