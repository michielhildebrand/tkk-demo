'use strict';

var tkkDemoApp = angular.module('tkkDemoApp', [
  'ngRoute',

  'HomeCtrl',
  'PlayCtrl',
  'TvCtrl',

  'app.player',
  'app.player-controls',

  'Data',
  'EventsBus',
  'MediaResource'
]);

tkkDemoApp.config(['$routeProvider',
  function ($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/home.html',
        controller: 'HomeCtrl'
      }).
      when('/video/:chapterIndex/:fragmentIndex', {
        templateUrl: 'partials/play.html',
        controller: 'PlayCtrl'
      }).
      when('/tv', {
        templateUrl: 'partials/tv.html',
        controller: 'TvCtrl'
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