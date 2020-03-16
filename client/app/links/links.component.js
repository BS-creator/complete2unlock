'use strict';
import swal from 'sweetalert';

const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './links.routes';

export class LinksComponent {
  /*@ngInject*/
  constructor($http) {
    this.$http = $http;
    this.reloadLinks();
  }

  reloadLinks() {
    console.log('reload');
    return this.$http.get('/api/links')
      .then((response) => {
        this.links = response.data;
      });
  }

  copyLink(link) {
    let copyLink = document.createElement('input');
    copyLink.value = link.shortUrl || `${window.location.protocol}//${link.domain}/${link.uniqueId}`;
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
}

export default angular.module('complete2unlockApp.links', [uiRouter])
  .config(routes)
  .component('links', {
    template: require('./links.html'),
    controller: LinksComponent,
    controllerAs: '$ctrl'
  })
  .name;
