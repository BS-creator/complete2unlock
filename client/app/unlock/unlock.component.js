'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './unlock.routes';
import swal from 'sweetalert';

let wo = window.open;

export class UnlockComponent {
  /*@ngInject*/
  constructor($http, $stateParams, $timeout, $state, $compile, $scope, $interval, $rootScope, c2uConfig) {
    this.$http = $http;
    this.$stateParams = $stateParams;
    this.$timeout = $timeout;
    this.$state = $state;
    this.$compile = $compile;
    this.$scope = $scope;
    this.$interval = $interval;
    this.$rootScope = $rootScope;
    this.c2uConfig = c2uConfig;

    $scope.$on('$destroy', () => {
      this.$rootScope.hideSidebar = false;
      this.$rootScope.sidebarOpen = true;
    });

    if ($state.current.name === 'unlockembed')
      this.$rootScope.embed = true;

    //this.ab();

    this.wait = 6;

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
      txtcolor: '#ffffff',
      color: '#1AAED0',
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
      name: 'CUSTOM',
      icon: '',
      txtcolor: '#ffffff',
      color: '#1ea0f3'
    }];

    this.loadLink($stateParams.uniqueId);
    //if(window.initApkButton)
    //  window.initApkButton();
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://serconmp.com/apu.php?zoneid=2884416';
    script.onload = () => {
      console.log('AD LOADED!!!');
    };
    document.getElementsByTagName('head')[0].appendChild(script);

    const script0 = document.createElement('script');
    script0.type = 'text/javascript';
    script0.src = 'https://serconmp.com/apu.php?zoneid=2884083';
    script0.onload = () => {
      console.log('AD LOADED!!!');
    };
    document.getElementsByTagName('head')[0].appendChild(script0);
  
  const script1 = document.createElement('script');
    script1.type = 'text/javascript';
    script1.src = 'https://serconmp.com/apu.php?zoneid=2958396';
    script1.onload = () => {
      console.log('AD LOADED!!!');
    };
    document.getElementsByTagName('head')[0].appendChild(script1);
  }
  
  ab() {
  }

  getCompleted() {
    let out = 0;

    ((this.link || {}).actions || []).forEach(action => {
      if (action.unlocked)
        out++;
    });
    return out;
  }

  loadLink(uniqueId) {
    this.$http.get(`/api/links/unlock/${uniqueId}`)
      .then(response => {
        this.link = response.data;
        //if(this.link.domain && this.link.domain.indexOf(window.location.hostname) === -1) {
        if(window.location.hostname !== (this.c2uConfig.maindomain || 'complete2unlock.com')) {
          window.location.href = `${window.location.protocol}//complete2unlock.com/${this.link.uniqueId}`;
          return;
        }
        (this.link.monetizedactions || []).forEach((action) => {
          this.link.actions.push(action);
        })


        this.$rootScope.hideSidebar = true;
        this.$rootScope.sidebarOpen = false;
      })
      .catch((err) => {
        console.log(err);
        if(!this.$rootScope.embed)
          this.$state.go('main');
      });
  }

  clickMobileOffer() {
    const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://pushlaram.com/pfe/current/tag.min.js?z=2933050';
      script.onload = () => {
        console.log('AD LOADED!!!');
      };
      document.getElementsByTagName('head')[0].appendChild(script);
      this.nOpened = true;
    
      this.$timeout(() => {
        this.nOpened = false;
        this.nUnlocked = true;
      }, 1000 * 5);
    /*let url = `https://mobileoffers-s-download.com/401/281?file=${this.link.title}`;
    if (navigator.userAgent.toLowerCase().indexOf('android') > -1) {
      window.location.href = url;
    } else {
      var tab = wo(url, '_blank');
      tab.focus()
    }*/
  }

  openLink(url) {
    var tab = wo(url, '_blank');
    tab.focus()
  }

  getActionBackground(action) {
    let out = '#000';
    this.channels.forEach(channel => {
      if (channel.name !== action.channel)
        return;
      out = channel.color;
    })

    return out;
  }

  getActionText(action) {
    let out = '#fff';
    this.channels.forEach(channel => {
      if (channel.name !== action.channel)
        return;
      out = channel.txtcolor;
    })

    return out;
  }

  unlockAction(action, monetized) {
    if (this.link.monetized && !monetized) {
      swal({
        text: `You successfully completed the task. \n Complete ${this.link.actions.length - this.getCompleted() - 1} more to get the link!`,
        icon: 'success',
        button: /*[*/ {
          text: 'Complete Action',
          value: 'bla',
          visible: true,
          className: 'swal-button--danger',
          closeModal: true,
        },
        /*{
                 text: 'DOWNLOAD APK',
                 value: 'DOWNLOAD APK',
                 visible: true,
                 className: 'admodalbutton',
                 closeModal: true,
               }],*/
        content: {
          element: 'div',
          id: 'completemodal'
        }
      }).then(button => {
        //if (button)
        //  this.clickMobileOffer();
      });
      let ad1 = angular.element('<adsquare></adsquare>');
      let ad2 = angular.element('<adsquare></adsquare>');
      angular.element(document.querySelector('.swal-content__div')).append(ad1);
      angular.element(document.querySelector('.swal-footer')).append(ad2);
      angular.element(document.querySelector('.swal-footer')).addClass('button-center');
      document.querySelector('.swal-button--danger').setAttribute('disabled', 'disabled');
      let left = 5;
      let i = this.$interval(() => {
        left--;
        //document.querySelector('.swal-button--danger').innerHTML = `${left} Secounds`;
        if (left > 0)
          return;
        this.$interval.cancel(i);
        document.querySelector('.swal-button--danger').innerHTML = 'Confirm';
        document.querySelector('.swal-button--danger').removeAttribute('disabled');
      }, 1000);
      //angular.element(document.querySelector('.swal-footer')).append('<div class="swal-button-container">advertisement</div>');

      this.$compile(ad1)(this.$scope);
      //this.$compile(ad2)(this.$scope);
    }



    action.opened = true;
    let url = encodeURIComponent(action.actionUrl.indexOf('http') === -1 ? `http://${action.actionUrl}` : action.actionUrl, '_blank');
    wo(`https://${this.link.domain}/redirect?url=${url}`);

    this.$timeout(() => {
      action.opened = false;
      action.unlocked = true;
    }, 1000 * 5);
  }





  isCompleted() {
    if(!this.link)
      return false;
    if(this.link.monetized && !this.nUnlocked)
      return false;
    let completed = true;
    if (!this.link)
      return;
    this.link.actions.forEach((action) => {
      if (!action.unlocked)
        completed = false;
    })

    return completed;
  }

  continueLink(gtoken) {
    if (!this.isCompleted())
      return console.log('!completed');
    if(!this.waitEnabled && this.link.monetized) {
      this.waitEnabled = true;
      console.log('show survey');
      this.waitInterval = this.$interval(() => {
        console.log(this.wait);
        this.wait--;
        if(this.wait <= 0)
          this.$interval.cancel(this.waitInterval);
      }, 1000);
      return console.log('!w1');
    }
    if(this.waitEnabled && this.wait > 0)
      return console.log('!w2');
    //grecaptcha.reset();
    window.onSubmit = (token) => {
      grecaptcha.reset();
      this.continueLink(token);
      //    this.$scope.form.token = '';//token;
      //    this.login(this.$scope.form);
      //document.getElementById("demo-form").submit();
    }
    if (!gtoken && this.link.monetized)
      return grecaptcha.execute();
    //let el = angular.element('<ad></ad>');

    swal({
      title: 'Success',
      text: 'The Link has been unlocked',
      icon: 'success',
      button: 'Continue',
      content: {
        element: 'div',
        id: 'completemodal'
      }
    }).then((ok) => {
      if (!ok)
        return;
      let token = this.link.monetizedactions.map((action) => action.token).join(',');
      this.$http.post(`/api/links/complete/${this.link.uniqueId}`, {
          token: token,
          linktoken: this.link.linktoken,
          gtoken: gtoken
        })
        .then((response) => {
          if(this.$rootScope.embed)
            return wo(response.data.url, '_blank');
          window.location.href = response.data.url;
        })
        .catch(err => swal({
          title: 'Error',
          text: err.data,
          icon: 'error'
        }));

    });
    var ad1 = angular.element('<adsquare></adsquare>');
    var ad2 = angular.element('<adsquare></adsquare>');
    angular.element(document.querySelector('.swal-content__div')).append(ad1);
    angular.element(document.querySelector('.swal-footer')).append(ad2);
    angular.element(document.querySelector('.swal-footer')).addClass('button-center');

    this.$compile(ad1)(this.$scope);
    //this.$compile(ad2)(this.$scope);
  }
}

export default angular.module('complete2unlockApp.unlock', [uiRouter])
  .config(routes)
  .component('unlock', {
    template: require('./unlock.html'),
    controller: UnlockComponent,
    controllerAs: '$ctrl'
  })
  .name;
