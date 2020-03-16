'use strict';
import swal from 'sweetalert';

const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './rotatingaction.routes';

export class RotatingactionComponent {
  /*@ngInject*/
  constructor($http) {
    this.$http = $http;
    this.reload();
  }

  reload() {
    this.$http.get('/api/rotatingactions')
      .then(response => {
        this.rotatingactions = response.data;
      });
  }

  delete(action) {
    swal({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this action!',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
      .then((willDelete) => {
        if (!willDelete)
          return;

        this.$http.delete(`/api/rotatingactions/${action._id}`).then(() => this.reload());
      });
  }
}

export class RotatingactionEditComponent {
  /*@ngInject*/
  constructor($http, $stateParams, $state) {
    this.channels = [{
      name: 'YOUTUBE',
      icon: 'fa fa-youtube',
      txtcolor: '#ffffff',
      color: '#c82333',
      actions: ['SUBSCRIBE', 'SUBSCRIBE_HITBELL', 'WATCH_VIDEO', 'COMMENT', 'LIKE_VIDEO',
        'DISLIKE_VIDEO', 'SUBSCRIBE_LIKE', 'SHARE_VIDEO', 'LIKE_COMMENT', 'SHARE_WHATSAPP'
      ]
    }, {
      name: 'SNAPSHAT',
      icon: 'snap.png',
      txtcolor: '#000',
      color: '#fcef2e',
      actions: ['SNAP_ME', 'ADD_ON_SNAPCHAT', 'VIEW_SNAPSHAT_STORY', 'SHARE_SNAPSHAT_STORY',
        'SCREENSHOT_SNAPSHAT_STORY'
      ]
    }, {
      name: 'MUSIC',
      icon: 'spotify.png',
      txtcolor: '#000',
      color: '#fff',
      actions: ['STRAM_ON_SPOTIFY', 'STRAM_ON_SOUNDCLOUD', 'STRAM_ON_APPLEMUSIC']
    }, {
      name: 'FACEBOOK',
      icon: '',
      txtcolor: '#fff',
      color: '#3b5998',
      actions: ['LIKE', 'SHARE', 'REACT', 'FOLLOW', 'COMMENT']
    }, {
      name: 'INSTAGRAM',
      icon: '1528381743.png',
      txtcolor: '#ffffff',
      color: '#a57457',
      actions: ['FOLLOW', 'LIKE', 'SHARE']
    }, {
      name: 'TWITTER',
      icon: '1528382313.png',
      txtcolor: '#ffffff',
      color: '#1ea0f3',
      actions: ['FOLLOW', 'RETWEET', 'COMMENT', 'LIKE']
    }, {
      name: 'DISCORD',
      icon: '1528382313.png',
      txtcolor: '#ffffff',
      color: '#1ea0f3',
      actions: ['JOIN_SERVER']
    }, {
      name: 'CUSTOM',
      icon: '',
      txtcolor: '#ffffff',
      color: '#1ea0f3'
    }];
    this.$http = $http;
    this.$stateParams = $stateParams;
    this.$state = $state;
    this.rotatingaction = {};
    if(this.$stateParams.id !== 'new')
      this.$http.get(`/api/rotatingactions/${this.$stateParams.id}`)
        .then(response => {
          this.rotatingaction = {
            channel: this.channels.find(channel => channel.name === response.data.action.channel),
            action: response.data.action.action,
            url: response.data.action.actionUrl
          };
        });

  }

  edit(channel, action, actionUrl) {
    if(this.$stateParams.id === 'new')
      this.$http.post(`/api/rotatingactions`, {
        action: {
          channel,
          action,
          actionUrl
        }})
        .then(() =>  this.$state.go('rotatingaction'));
    else
      this.$http.put(`/api/rotatingactions/${this.$stateParams.id}`, {
        action: {
          channel,
          action,
          actionUrl
        }})
        .then(() =>  this.$state.go('rotatingaction'));
  }
}

export default angular.module('complete2unlockApp.rotatingaction', [uiRouter])
  .config(routes)
  .component('rotatingaction', {
    template: require('./rotatingaction.html'),
    controller: RotatingactionComponent,
    controllerAs: '$ctrl'
  })
  .component('rotatingactionedit', {
    template: require('./edit.html'),
    controller: RotatingactionEditComponent,
    controllerAs: '$ctrl'
  })
  .name;
