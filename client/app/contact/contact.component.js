'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './contact.routes';

export class ContactComponent {
  /*@ngInject*/
  constructor($filter, Auth) {
    this.isLoggedIn = Auth.isLoggedInSync;
    $('#feedback-form').ZammadForm({
      messageTitle: $filter('translate')('CONTACT_FORM_TITLE'),
      messageSubmit: $filter('translate')('CONTACT_FORM_SUBMIT'),
      messageThankYou: $filter('translate')('CONTACT_FORM_THANKYOU'),
      showTitle: true
    });
    document.querySelector('textarea').setAttribute('minlength', 200);
  }
}

export default angular.module('complete2unlockApp.contact', [uiRouter])
  .config(routes)
  .component('contact', {
    template: require('./contact.html'),
    controller: ContactComponent,
    controllerAs: '$ctrl'
  })
  .name;
