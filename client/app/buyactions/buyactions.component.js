'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './buyactions.routes';
import swal from 'sweetalert';

export class BuyactionsComponent {
  /*@ngInject*/
  constructor($http, Auth, c2uConfig) {
    this.c2uConfig = c2uConfig;
    this.$http = $http;
    this.Auth = Auth;
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
  }

  checkout(channel, action, url, amount, user) {
    this.$http.post('/api/monetizedactions', {
      channel,
      action,
      url,
      amount,
      user
    }).then((response) => {
      window.location.href = response.data.url;
    })
    .catch(err => swal({
      title: 'Error',
      text: err.data,
      icon: 'error'
    }));
  }

  getFreeActions(maxamount) {
    let amount = Math.floor((this.Auth.getCurrentUserSync().affiliateStats.completions - this.Auth.getCurrentUserSync().affiliateStats.completionsPayout) * 0.1 / 500) * 500;
    return maxamount > amount ? amount : maxamount;
  }
}

export default angular.module('complete2unlockApp.buyactions', [uiRouter])
  .config(routes)
  .component('buyactions', {
    template: require('./buyactions.html'),
    controller: BuyactionsComponent,
    controllerAs: '$ctrl'
  })
  .name;
