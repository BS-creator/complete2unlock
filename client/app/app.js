'use strict';

import angular from 'angular';
// import ngAnimate from 'angular-animate';
import ngCookies from 'angular-cookies';
import ngResource from 'angular-resource';
import ngSanitize from 'angular-sanitize';


import uiRouter from 'angular-ui-router';
import uiBootstrap from 'angular-ui-bootstrap';

import 'angular-validation-match';

import {
  routeConfig
} from './app.config';


import _Auth from '../components/auth/auth.module';
import account from './account';
import admin from './admin';
import navbar from '../components/navbar/navbar.component';
import footer from '../components/footer/footer.component';
import main from './main/main.component';
import constants from './app.constants';
import util from '../components/util/util.module';
import ad from '../components/ad/ad.directive';

import ngTranslate from 'angular-translate';
import ngTranslateLoaderStaticFiles from 'angular-translate-loader-static-files';

import HomeComponent from './home/home.component';
import CreateComponent from './create/create.component';
import UnlockComponent from './unlock/unlock.component';
import EditComponent from './edit/edit.component';
import PrivacypolicyComponent from './privacypolicy/privacypolicy.component';
import TermsconditionComponent from './termscondition/termscondition.component';
import ContactComponent from './contact/contact.component';
import PayoutComponent from './payout/payout.component';
import BuyactionsComponent from './buyactions/buyactions.component';
import LinksComponent from './links/links.component';
import PremiumactionsComponent from './premiumactions/premiumactions.component';
import BookmarkletComponent from './bookmarklet/bookmarklet.component';
import AffiliateComponent from './affiliate/affiliate.component';
import RotatingactionComponent from './rotatingaction/rotatingaction.component';


import './app.scss';


angular.module('complete2unlockApp', [ngCookies, ngResource, ngSanitize, uiRouter, uiBootstrap, ad, ngTranslate, ngTranslateLoaderStaticFiles,
    _Auth, account, admin, 'validation.match', navbar, footer, main, constants, util, 'pascalprecht.translate',
    HomeComponent, CreateComponent, EditComponent, PrivacypolicyComponent, TermsconditionComponent, PayoutComponent,
    BuyactionsComponent, ContactComponent, LinksComponent, PremiumactionsComponent, BookmarkletComponent, AffiliateComponent,
    RotatingactionComponent, UnlockComponent
  ])
  .config(routeConfig)
  .run(function($rootScope, $location, Auth, $cookies) {
    'ngInject';
    if($location.search().aff)
      $cookies.put('affiliateId', $location.search().aff, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
      });
    // Redirect to login if route requires auth and you're not logged in
    angular.element(document.querySelector('#main-loader')).addClass('hide');
    angular.element(document.querySelector('#main-wrapper')).removeClass('hide');
    $rootScope.$on('$stateChangeStart', function(event, next) {
      Auth.isLoggedIn(function(loggedIn) {
        if (next.authenticate && !loggedIn) {
          $location.path('/login');
        }
      });
    });
    $rootScope.hideSidebar = true;
  });
  angular.injector(['ng']).get('$http').get('/api/configs').then((response) =>
    angular.module('complete2unlockApp.c2uConfig', []).constant('c2uConfig', response.data)
  ).then(() => {
    angular.element(document)
      .ready(() => {
        angular.bootstrap(document, ['complete2unlockApp', 'complete2unlockApp.c2uConfig'], {

        });
      });
  })

$(function() {
  new ZammadChat({
    background: 'rgb(20,65,156)',
    fontSize: '12px',
    flat: true,
    chatId: 1
  });
});
