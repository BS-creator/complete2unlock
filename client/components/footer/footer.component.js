import angular from 'angular';

export class FooterComponent {

  constructor($rootScope, $http, $location, Auth) {
    this.isLoggedIn = Auth.isLoggedInSync;
    this.$rootScope = $rootScope;
    $http.get(`/api/configs/latest?hostname=${location.hostname}&path=${$location.path()}`)
      .then(response => {
        this.links = response.data;
      });
  }
}

export default angular.module('directives.footer', [])
  .component('footer', {
    template: require('./footer.html'),
    controller: FooterComponent
  })
  .name;
