'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './edit.routes';
import swal from 'sweetalert';


export class EditComponent {
  /*@ngInject*/
  constructor($http, $stateParams, $state, $scope) {
    this.$http = $http;
    this.$stateParams = $stateParams;
    this.$state = $state;
    this.$scope = $scope;

    this.channels = require('../create/channels');

    this.loadLink($stateParams.uniqueId);
  }

  loadLink(uniqueId) {
    this.$http.get('/api/links/' + uniqueId)
      .then(response => {
        this.link = response.data;
        var sortable = [];
        for (var country in this.link.completionCountries) {
          sortable.push([country, this.link.completionCountries[country]]);
        }
        sortable.sort(function(a, b) {
          return a[1] - b[1];
        });
        this.topCountries = sortable;
      })
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
        return a[1] - b[1];
      });
      this.topCountries = sortable;
      console.log(this.topCountries);
      resolve();
    }));
  }



  addAction(form) {
    this.link.actions.push({
      action: form.action,
      channel: form.channel.name,
      actionUrl: form.actionUrl
    });

  }

  save() {
    this.$http.patch('/api/links/' + this.link._id, {
      name: this.link.name,
      title: this.link.title,
      buttonText: this.link.buttonText,
      lockedUrl: this.link.lockedUrl,
      uniqueId: this.link.uniqueId,
      actions: this.link.actions,
      monetized: this.link.monetized
    }).then(() => {
      swal('Saved', 'Your changes have been saved', 'success', {
        button: 'Continue!',
      }).then(() => this.$state.go('home'));
    });
  }

  delete() {
    swal({
        title: 'Are you sure?',
        text: 'Once deleted, you will not be able to recover this link!',
        icon: 'warning',
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (!willDelete)
          return;

        this.$http.delete('/api/links/' + this.link._id).then(() => {
          this.$state.go('home')
        });
      });
  }

  removeAction(action) {
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
        this.link.actions.splice(this.link.actions.indexOf(action), 1);
        this.$scope.$apply();
      });
  }
}

export default angular.module('complete2unlockApp.edit', [uiRouter])
  .config(routes)
  .component('edit', {
    template: require('./edit.html'),
    controller: EditComponent,
    controllerAs: '$ctrl'
  })
  .name;
