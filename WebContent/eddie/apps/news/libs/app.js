'use strict';

var tkkDemoApp = angular.module('tkkDemoApp', [
  'ngRoute',
  'tkkControllers',
  'tkkServices'
]);

tkkDemoApp.config(['$routeProvider',
  function ($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: '/eddie/apps/news/libs/ng/partials/landing.html',
        controller: 'LandingCtrl'
      }).
      when('/video/:chapterIndex/:fragmentIndex', {
        templateUrl: '/eddie/apps/news/libs/ng/partials/player.html',
        controller: 'PlayerCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
  }
]).constant('CONFIG', {
  API_ROOT: 'http://data.linkedtv.eu'
}).filter('trusted', ['$sce',
  function ($sce) {
    return function(url) {
      return $sce.trustAsResourceUrl(url);
    };
  }]
);