'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './home.routes';
import swal from 'sweetalert';


export class HomeComponent {
  /*@ngInject*/
  constructor($http, Auth) {
    this.$http = $http;
    this.Auth = Auth;

    this.reloadLinks();
    this.reloadMonetizedActions();
    this.reloadPayouts();
    this.sortCountries()
      .then(() => {
        let data = {};
        for(var item in this.currentUser.completionCountries)
          data[item.toLowerCase()] = this.currentUser.completionCountries[item];
        $('#world-map').vectorMap({
          map              : 'world_en',
          backgroundColor  : 'transparent',
          regionStyle      : {
            initial: {
              fill            : 'rgba(255, 255, 255, 0.7)',
              'fill-opacity'  : 1,
              stroke          : 'rgba(0,0,0,.2)',
              'stroke-width'  : 1,
              'stroke-opacity': 1
            }
          },
          showTooltip: true,
          enableZoom: true,
          values: data,
          onLabelShow:  (e, el, code) => {
            if (typeof data[code] != 'undefined')
              el.html(el.html() + ': ' + data[code] + ' completions');
          }
        })
      });
  }

  sortCountries() {
    return new Promise((resolve, reject) => this.Auth.getCurrentUser((user) => {
      this.currentUser = user;
      console.log('user', user);
      var sortable = [];
      for (var country in user.completionCountries) {
        sortable.push([country, user.completionCountries[country]]);
      }

      sortable.sort(function(a, b) {
        return b[1] - a[1];
      });
      this.topCountries = sortable;
      console.log(this.topCountries);
      resolve();
    }));
  }

  reloadLinks() {
    return this.$http.get('/api/links')
      .then((response) => {
        this.links = response.data;
      });
  }

  reloadMonetizedActions() {
    return this.$http.get('/api/monetizedactions')
      .then((response) => {
        this.monetizedactions = response.data;
      });
  }

  reloadPayouts() {
    return this.$http.get('/api/payouts')
      .then((response) => {
        this.payouts = response.data;
      });
  }

  copyLink(link) {
    let copyLink = document.createElement('input');
    copyLink.value = `${window.location.protocol}//${link.domain}/${link.uniqueId}`;
    copyLink.type = 'text';
    copyLink.id = 'copyLink';
    copyLink.readOnly = true;

    let copyEmbed = document.createElement('textarea');
    copyEmbed.innerText = `<iframe src="https://${link.domain}/embed/${link.uniqueId}" style="border:none; width: 460px; height: ${341 + link.actions.length * 139 + (link.monetized ? 139 : 0)}px"></iframe>`;
    copyEmbed.id = 'copyEmbed';
    copyEmbed.style = 'height: 120px';
    copyEmbed.readOnly = true;

    let share = document.createElement('div');
    share.append(copyLink);
    share.append('Embed code:');
    share.append(copyEmbed);
    swal('Share Link:', {
      content: share
    });

    document.getElementById('copyLink').onclick = function() {
      console.log('test');
      var copyText = document.getElementById('copyLink');
      copyText.select();
      document.execCommand('copy');
      alert('Copied to clipboard: ' + copyText.value);
    }

  }

  getTotalViews() {
    let out = 0;
    if (!this.links)
      return 0;
    this.links.forEach((link) => {
      out += link.views;
    });
    return out;
  }

  getTotalCompletions() {
    let out = 0;
    if (!this.links)
      return 0;
    this.links.forEach((link) => {
      out += link.completions;
    });
    return out;
  }
}

export default angular.module('complete2unlockApp.home', [uiRouter])
  .config(routes)
  .component('home', {
    template: require('./home.html'),
    controller: HomeComponent,
    controllerAs: '$ctrl'
  })
  .name;
