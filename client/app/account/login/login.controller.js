'use strict';

import swal from 'sweetalert';

export default class LoginController {
  user = {
    name: '',
    email: '',
    password: ''
  };
  errors = {
    login: undefined
  };
  submitted = false;


  /*@ngInject*/
  constructor(Auth, $state, $http) {
    this.Auth = Auth;
    this.$state = $state;
    this.$http = $http;
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
        return;//this.forgotPassword();
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

  login(form) {
    this.submitted = true;
    //if(form.$valid) {
      this.Auth.login({
        email: this.user.email,
        password: this.user.password
      })
        .then(() => {
          // Logged in, redirect to home
          this.$state.go('home');
        })
        .catch(err => {
          swal('Login error', err.message, 'error');
          //this.errors.login = err.message;
        });
    //}
  }
}
