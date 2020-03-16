'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './create.routes';
import swal from 'sweetalert';


export class CreateComponent {
  /*@ngInject*/
  constructor($http, $state, $location) {
    this.$http = $http;
    this.$state = $state;
    //'YOUTUBE', 'SNAPSHAT', 'MUSIC', 'FACEBOOK', 'INSTAGRAM', 'TWITTER'

    this.channels = require('./channels.js');
    this.link = {
      monetized: true,
      urltype: 'auto',
      actions: [{
        channel: this.channels[0],
        action: this.channels[0].actions[0]
      }]
    };

    if($location.search().lockedurl)
      this.link.lockedUrl = $location.search().lockedurl;
    this.urltype = 'user';
  }

  addAction() {
    this.link.actions.push({
      channel: this.channels[0],
      action: this.channels[0].actions[0]
    });
  }

  checkAvailability(uniqueId) {
    return new Promise((resolve, reject) => {
      this.$http.get(`/api/links/unlock/${uniqueId}`)
        .then(response => {
          resolve(false);
        })
        .catch(() => resolve(true));
    })
  }

  checkAvailabilityAndModal(uniqueId) {
    this.checkAvailability(uniqueId)
      .then((avarible) => {
        if (avarible)
          return swal({
            title: 'Custom URL is avarible',
            text: 'The custom url you entered is avarible',
            icon: 'success',
            button: 'Continue'
          });
        swal({
          title: 'Custom URL not avarible',
          text: 'The custom url you entered is already in use',
          icon: 'error',
          button: 'Choose other'
        });
      })
  }

  removeAction(action) {
    this.link.actions.splice(this.link.actions.indexOf(action), 1);
  }

  createLink() {
    let actions = [];
    this.link.actions.forEach(action => actions.push({
      channel: action.channel.name,
      action: action.action,
      customContent: action.customContent,
      actionUrl: action.actionUrl,
      useAPI: action.useAPI
    }));
    this.$http.post('/api/links', {
      name: this.link.name,
      title: this.link.title,
      monetized: this.link.monetized,
      buttonText: this.link.buttonText,
      lockedUrl: this.link.lockedUrl,
      uniqueId: this.link.uniqueId,
      actions: actions
    }).then(() => {
      this.$state.go('home');
    }).catch((err) => {
      if (err.data !== 'url already in use')
        return console.log(err.data);
      swal({
        title: 'Custom URL not avarible',
        text: 'The custom url you entered is already in use',
        icon: 'error',
        button: 'Choose other'
      });
    });
  }
}

export default angular.module('complete2unlockApp.create', [uiRouter])
  .config(routes)
  .component('create', {
    template: require('./create.html'),
    controller: CreateComponent,
    controllerAs: '$ctrl'
  })
  .name;
