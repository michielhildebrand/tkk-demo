'use strict';

var tkkDemoApp = angular.module('tkkDemoApp', [
  'ngRoute',
  'ui.bootstrap',

  'Config',

  'SelectCtrl',
  'EpisodesCtrl',
  'PlayCtrl',
  'TvCtrl',

  'app.player',
  'app.player-controls',
  'app.chapters-overview',
  'app.chapter-item',
  'app.chapter-about',
  'app.chapter-related',
  'app.chapter-artworks',
  'app.chapter-articles',
  'app.bookmarking',
  'app.bookmarks',
  'app.information-card',
  'app.seek-bar',

  'Eddie',
  'Model',
  'EventsBus',
  'EntityProxy',
  'EuropeanaApi'
]);

tkkDemoApp.config(['$routeProvider',
  function ($routeProvider) {
    $routeProvider.
      when('/', {
        title: ' - Select user',
        templateUrl: 'partials/controllers/select.html',
        controller: 'SelectCtrl'
      }).
      when('/episodes/:user', {
        title: ' - Episodes',
        templateUrl: 'partials/controllers/episodes.html',
        controller: 'EpisodesCtrl'
      }).
      when('/play/:user/:videoId/:chapterIndex', {
        title: ' - Play',
        templateUrl: 'partials/controllers/play.html',
        controller: 'PlayCtrl'
      }).
      when('/tv/:user', {
        title: ' - TV',
        templateUrl: 'partials/controllers/tv.html',
        controller: 'TvCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
  }
]).run(['$location', '$rootScope', '$route', 'Config', 'eventsBus', 'Model',
    function ($location, $rootScope, $route, Config, eventsBus, Model) {
      $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = Config.app_title_prefix;
        if (current.$$route != null) $rootScope.title += current.$$route.title;
      });

      var syncBookmarks = function (bookmarks) {
        _.each(bookmarks, function (b) {
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
