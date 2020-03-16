'use strict';

import swal from 'sweetalert';


export default class AdminController {
  /*@ngInject*/
  constructor(User, $http) {
    this.$http = $http;
    this.User = User;
    // Use the User $resource to fetch all users

    this.reloadPayouts();
    this.reloadMonetizedActions();
    this.reloadConfig();
  }

  reloadUsers() {
    this.users = this.User.query();
  }

  reloadConfig() {
    this.$http.get('/api/configs/?cache=' + (Math.random() * 999999))
      .then(response => {
        this.config = JSON.stringify(response.data, null, '\t');
      });
  }

  saveConfig(config) {
    this.$http.post('/api/configs', JSON.parse(config))
      .then(response => {
        this.config = JSON.stringify(response.data, null, '\t');
      });
  }

  reloadPayouts() {
    this.$http.get('/api/payouts/admin?status=PENDING')
      .then(response => {
        this.payouts = response.data;
      });
  }

  reloadMonetizedActions() {
    return this.$http.get('/api/monetizedactions?admin=true')
      .then((response) => {
        this.monetizedactions = response.data;
      });
  }

  delete(user) {
    swal({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this user!',
      icon: 'error',
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (!willDelete)
        return;
      user.$remove();
      this.users.splice(this.users.indexOf(user), 1);
    });
  }

  completePayout(payout) {
    swal({
      title: 'Payout proccessed?',
      text: 'money send?',
      icon: 'success',
      buttons: true
    })
      .then(ok => ok ? this.$http.post(`/api/payouts/admin/${payout._id}`) : () => {})
      .then(() => this.reloadPayouts());
  }
}
