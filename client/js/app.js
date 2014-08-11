'use strict';

var tkkDemoApp = angular.module('tkkDemoApp', [
  'ngRoute',

  'HomeCtrl',
  'PlayCtrl',
  'TvCtrl',

  'app.player',
  'app.player-controls',
  'app.chapter-list',
  'app.bookmarking',
  'app.bookmarks',

  'Data',
  'EventsBus',
  'MediaResource'
]);

tkkDemoApp.config(['$routeProvider',
  function ($routeProvider) {
    $routeProvider.
      when('/', {
        title: 'TKK Demo',
        templateUrl: 'partials/home.html',
        controller: 'HomeCtrl'
      }).
      when('/play/:chapterIndex', {
        title: 'TKK Demo - Chapter',
        templateUrl: 'partials/play.html',
        controller: 'PlayCtrl'
      }).
      when('/tv', {
        title: 'TKK Demo - TV',
        templateUrl: 'partials/tv.html',
        controller: 'TvCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
  }
]).constant('CONFIG', {
  API_ROOT: 'http://data.linkedtv.eu'
}).filter('trusted', [
    '$sce',
    function ($sce) {
      return function (url) {
        return $sce.trustAsResourceUrl(url);
      };
    }
  ]
).run([
    '$location',
    '$rootScope',
    function ($location, $rootScope) {
      $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
      });
    }
  ]
);
