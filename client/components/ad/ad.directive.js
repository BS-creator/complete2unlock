'use strict';
const angular = require('angular');

export default angular.module('complete2unlockApp.ad', [])
  .directive('ad', function() {
    return {
      template: require('./ad.html'),
      restrict: 'EA',
      link: function(scope, element, attrs) {},
      controller: function($scope, $sce) {
        //$scope.rand = $sce.trustAsResourceUrl(Math.round(Math.random() * 99999999));
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    };
  }).directive('adsquare', function() {
    return {
      template: require('./adsquare.html'),
      restrict: 'EA',
      link: function(scope, element, attrs) {},
      controller: function($scope, $sce) {
        //$scope.rand = $sce.trustAsResourceUrl(Math.round(Math.random() * 99999999));
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    };
  }).directive('adnonscroll', function() {
    return {
      template: require('./adnonscroll.html'),
      restrict: 'EA',
      link: function(scope, element, attrs) {},
      controller: function($scope, $sce) {
        //$scope.rand = $sce.trustAsResourceUrl(Math.round(Math.random() * 99999999));
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    };
  })
  .name;
