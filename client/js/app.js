'use strict';

var tkkDemoApp = angular.module('tkkDemoApp', [
  'ngRoute',
  'ui.bootstrap',

  'HomeCtrl',
  'PlayCtrl',
  'TvCtrl',
  'EnrichCtrl',

  'app.player',
  'app.player-controls',
  'app.chapters-overview',
  'app.chapter-item',
  'app.chapter-about',
  'app.chapter-related',
  'app.bookmarking',
  'app.bookmarks',
  'app.information-card',
  'app.seek-bar',

  'Model',
  'EventsBus',
  'EntityProxy'
]);

tkkDemoApp.config(['$routeProvider',
  function ($routeProvider) {
    $routeProvider.
      when('/', {
        title: 'TKK Demo',
        templateUrl: 'partials/controllers/home.html',
        controller: 'HomeCtrl'
      }).
      when('/play/:videoId/:chapterIndex', {
        title: 'TKK Demo - Chapter',
        templateUrl: 'partials/controllers/play.html',
        controller: 'PlayCtrl'
      }).
      when('/tv', {
        title: 'TKK Demo - TV',
        templateUrl: 'partials/controllers/tv.html',
        controller: 'TvCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
  }
]).constant('CONFIG', {
  ENTITY_PROXY: 'http://linkedtv.project.cwi.nl/explore/entity_proxy'
}).filter('trusted', [
    '$sce',
    function ($sce) {
      return function (url) {
        return $sce.trustAsResourceUrl(url);
      };
    }
  ]
).run(['$location', '$rootScope', 'eventsBus', 'Model',
    function ($location, $rootScope, eventsBus, Model) {
      $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
      });

      var syncBookmarks = function(bookmarks) {
        _.each(bookmarks, function(b) {
          Model.bookmark(b);
        });
        $rootScope.$$phase || $rootScope.$apply();
      };

      function syncVideos(videos) {
        Model.setVideos(videos);
        $rootScope.$$phase || $rootScope.$apply();
      }

      eventsBus.subscribe('video', syncVideos);
      eventsBus.subscribe('bookmark', syncBookmarks);
    }
  ]
);
