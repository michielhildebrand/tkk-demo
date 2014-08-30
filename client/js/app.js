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
  'app.video-overview',
  'app.video-chapter',
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
]).run(['$location', '$rootScope', 'Config', 'eventsBus', 'Model', 'Eddie',
    function ($location, $rootScope, Config, eventsBus, Model, Eddie) {
      $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        if (current.$$route != null) {
          $rootScope.title = Config.app_title_prefix + current.$$route.title;

          if (['', '/'].indexOf(current.$$route.originalPath) == -1) {
            var user = current.params.user;
            if (user != null && _(Config.users).contains(user)) {
              Eddie.init(user);
            } else {
              console.log('Not a valid user ' + user);
              $location.path('/');
            }
          }
        }
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
