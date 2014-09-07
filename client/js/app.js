'use strict';

var tkkDemoApp = angular.module('tkkDemoApp', [
  'ionic',
  'ui.router',
  //'ui.bootstrap',

  'Config',

  'SelectCtrl',
  'EpisodesCtrl',
  'PlayCtrl',
  'TvCtrl',

  'app.player',
  'app.player-controls',
  'app.video-overview',
  'app.video-chapter',
  'app.chapter-list',
  'app.chapter-about',
  'app.chapter-related',
  'app.chapter-artworks',
  'app.chapter-articles',
  'app.bookmarking',
  'app.bookmarks',
  'app.information-card',
  'app.seek-bar',
  'app.chapter-enrich',

  'Eddie',
  'Model',
  'EventsBus',
  'EntityProxy',
  'EuropeanaApi'
]);

tkkDemoApp.config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/");

    $stateProvider.
      state('select', {
        url: '/',
        title: ' - Select user',
        templateUrl: 'partials/controllers/select.html',
        controller: 'SelectCtrl'
      }).
      state('episodes', {
        url: '/episodes/:user',
        title: ' - Episodes',
        templateUrl: 'partials/controllers/episodes.html',
        controller: 'EpisodesCtrl'
      }).
      state('play', {
        url: '/play/:user/:videoId?idx',
        title: ' - Play',
        templateUrl: 'partials/controllers/play.html',
        controller: 'PlayCtrl',
        reloadOnSearch: false
      }).
      state('tv', {
        url: '/tv/:user',
        title: ' - TV',
        templateUrl: 'partials/controllers/tv.html',
        controller: 'TvCtrl'
      });
  }
]).run(['$rootScope', '$state', 'Config', 'eventsBus', 'Model', 'Eddie',
    function ($rootScope, $state, Config, eventsBus, Model, Eddie) {
      $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        $rootScope.title = Config.app_title_prefix + toState.title;

        if (toParams.user != null) {
          var user = toParams.user;
          if (user != null && _(Config.users).contains(user)) {
            Eddie.init(user);
          } else {
            console.log('Not a valid user ' + user);
            $state.go('select');
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
