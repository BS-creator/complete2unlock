'use strict';
/* eslint no-sync: 0 */

import angular from 'angular';

export class NavbarComponent {
  menu = [{
    title: 'Home',
    state: 'main'
  }];

  isCollapsed = true;

  constructor(Auth, $rootScope, $translate, $cookies, $state) {
    'ngInject';
    this.$translate = $translate;
    this.$cookies = $cookies;
    this.$rootScope = $rootScope;
    this.$state = $state;

    this.isLoggedIn = Auth.isLoggedInSync;
    this.isAdmin = Auth.isAdminSync;
    this.getCurrentUser = Auth.getCurrentUserSync;

    this.langs = ['en', 'de', 'es', 'idn', 'prt'];

    if ($cookies.get('lang'))
      $translate.use($cookies.get('lang'));

    $rootScope.$on('$translateChangeSuccess', (_event, current) => {
      this.currentLang = current.language;
    });

    if(document.documentElement.clientWidth > 768)
      this.$rootScope.sidebarOpen = true;
    $rootScope.closeSidebar = () => {
      if(document.documentElement.clientWidth > 768)
        return;
      this.$rootScope.sidebarOpen = false;
    }
  }

  toggleSidebar() {
    this.$rootScope.sidebarOpen = !this.$rootScope.sidebarOpen;
  }

  changeLang(lang) {
    console.log('changelang', lang);
    this.$translate.use(lang);
    this.$cookies.put('lang', lang);
    this.showDropdown = false;
  }

}

export class SidebarComponent {
  menu = [{
    title: 'NAV_HOME',
    state: 'home',
    classes: 'fa-home'
  }, {
    title: 'LINKS_TITLE',
    state: 'links',
    classes: 'fa-link'
  }, {
    title: 'ROTATINGACTION_TITLE',
    state: 'rotatingaction',
    classes: 'fa-refresh'
  }, {
    title: 'PAYOUT_TITLE',
    state: 'payout',
    classes: 'fa-money '
  }, {
    title: 'AF_TITLE',
    state: 'affiliate',
    classes: 'fa-user'
  }, {
    title: 'NAV_SETTINGS',
    state: 'settings',
    classes: 'fa-cog'
  }];

  isCollapsed = true;

  constructor(Auth, $state, $translate, $cookies) {
    this.$state = $state;
    this.$translate = $translate;
    this.$cookies = $cookies;
    this.isLoggedIn = Auth.isLoggedInSync;
    this.isAdmin = Auth.isAdminSync;
    this.getCurrentUser = Auth.getCurrentUserSync;
    this.langs = ['en', 'de', 'es', 'idn', 'prt'];
  }

  changeLang(lang) {
    console.log('changelang', lang);
    this.$translate.use(lang);
    this.$cookies.put('lang', lang);
    this.showDropdown = false;
  }


}

export default angular.module('directives.navbar', [])
  .component('navbar', {
    template: require('./navbar.html'),
    controller: NavbarComponent
  })
  .component('sidebar', {
    template: require('./sidebar.html'),
    controller: SidebarComponent
  })
  .name;
