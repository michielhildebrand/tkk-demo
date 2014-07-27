'use strict';

var tkkDemoApp = angular.module('tkkDemoApp', [
  'ngRoute',

  'LandingCtrl',
  'PlayerCtrl',

  'tkkDirectives',

  'Data',
  'EventsBus',
  'MediaResource'
]);

tkkDemoApp.config(['$routeProvider',
  function ($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/landing.html',
        controller: 'LandingCtrl'
      }).
      when('/video/:chapterIndex/:fragmentIndex', {
        templateUrl: 'partials/player.html',
        controller: 'PlayerCtrl'
      }).
      when('/tv', {
        templateUrl: 'partials/landing.html',
        controller: 'LandingCtrl'
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