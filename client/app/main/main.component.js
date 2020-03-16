'use strict';

import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';
import swal from 'sweetalert';

const Typed = require('typed.js');

export class MainController {
  /*@ngInject*/
  constructor(Auth, $state, $scope, $http, $cookies) {
    this.Auth = Auth;
    this.$state = $state;
    this.$scope = $scope;
    this.$http = $http;
    this.$cookies = $cookies;
    Auth.isLoggedIn()
      .then((isLoggedIn) => {
        if (isLoggedIn)
          $state.go('home');
      });

    /*var typed = new Typed('#hometitle', {
      strings: ['Complete 2 Unlock', 'Subscribe 2 Unlock', 'Follow 2 Unlock', 'Add 2 Unlock', 'Like 2 Unlock', 'Comment 2 Unlock'],
      typeSpeed: 100,
      loop: true,
      showCursor: false,
      backSpeed: 50
    });

    $scope.$on('$destroy', () => {
      typed.destroy();
      document.getElementById('hometitle').innerText = 'Complete 2 Unlock';
    });*/
  }

  forgotPassword() {
    swal({
      text: 'Enter email address',
      content: 'input',
      button: {
        text: 'Send new password',
        closeModal: false,
      },
    }).then((email) => {
      if (!email)
        this.forgotPassword();
      //grecaptcha.reset();
      //window.onSubmit = (token) => {
      //console.log(token);
      this.$http.post('/api/users/forgot', {
        email: email,
        token: '' //token
      }).then(() => {
        swal({
          title: 'Success!!',
          text: 'A new password has been send to your email address\nPlease check your spam folder!!',
          icon: 'success',
        });
      }).catch((err) => {
        swal({
          title: 'Error!!',
          text: err.data.message,
          icon: 'error',
        });
      });
      //}
      //grecaptcha.execute();

    })
  }

  register(form) {
    this.submitted = true;
    //if (!this.$scope.form.token) {
    //grecaptcha.reset();
    //window.onSubmit = (token) => {
    //console.log(token);
    //    this.$scope.form.token = '';//token;
    //    this.register(this.$scope.form);
    //  //}
    //  return grecaptcha.execute();
    //}

    return this.Auth.createUser({
        name: form.name,
        email: form.email,
        password: form.password,
        token: form.token,
        affiliateId: this.$cookies.get('affiliateId')
      })
      .then(() => {
        this.submitted = false;
        // Account created, redirect to home
        this.$state.go('home');
      })
      .catch(err => {
        this.submitted = false;
        swal({
          title: 'Register Error',
          text: err.data.message,
          icon: 'error',
        });
      });
  }

  login(form) {
    //  if (!this.$scope.form.token) {
    //window.onSubmit = (token) => {
    //console.log(token);
    //grecaptcha.reset();
    //    this.$scope.form.token = '';//token;
    //    this.login(this.$scope.form);
    //document.getElementById("demo-form").submit();
    //}
    //return grecaptcha.execute();
    //}
    this.submitted = true;

    //if(form.$valid) {
    this.Auth.login({
        email: form.email,
        password: form.password,
        token: form.token
      })
      .then(() => {
        // Logged in, redirect to home
        this.$state.go('home');
      })
      .catch(err => {
        swal({
          title: 'Login Error',
          text: err.data.message,
          icon: 'error',
        });
      });
    //}
  }

}

export default angular.module('complete2unlockApp.main', [uiRouter])
  .config(routing)
  .component('main', {
    template: require('./main.html'),
    controller: MainController,
    controllerAs: '$ctrl'
  })
  .name;
