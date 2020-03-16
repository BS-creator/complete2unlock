'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('rotatingaction', {
      url: '/rotatingaction',
      template: '<rotatingaction></rotatingaction>'
    })
    .state('rotatingaction-edit', {
      url: '/rotatingaction/:id',
      template: '<rotatingactionedit></rotatingactionedit>'
    });
}
