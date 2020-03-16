'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './bookmarklet.routes';

export class BookmarkletComponent {
  /*@ngInject*/
  constructor() {
    this.message = 'Hello';
  }
}

export default angular.module('complete2unlockApp.bookmarklet', [uiRouter])
  .config(routes)
  .component('bookmarklet', {
    template: require('./bookmarklet.html'),
    controller: BookmarkletComponent,
    controllerAs: 'bookmarkletCtrl'
  })
  .name;
