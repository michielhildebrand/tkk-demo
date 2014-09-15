'use strict';

var tkkDemoApp = angular.module('tkkDemoApp', [
  'ui.router',
  'ionic',
  
  'Config',

  'SelectCtrl',
  'EpisodesCtrl',
  'PlayCtrl',
  'TvCtrl',

  'app.player',
  'app.player-controls',
  'app.video-overview',
  'app.video-chapter',
  'app.chapter-selection',
  'app.chapter-about',
  'app.chapter-artworks',
  'app.chapter-background',
  'app.chapter-related',
  'app.bookmarks',
  'app.information-card',
  'app.seek-bar',
  'app.chapter-enrich',
  'app.visible-on-load',

  'Eddie',
  'Model',
  'EventsBus',
  'EntityProxy',
  'EuropeanaApi',
  'IRApi'
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
])
.config(['$ionicTabsConfig', function($ionicTabsConfig) {
  // Override the Android platform default to add "tabs-striped" class to "ion-tabs" elements.
  $ionicTabsConfig.type = '';
}])
.run(['$rootScope', '$state', 'Config', 'eventsBus', 'Model', 'Eddie',
    function ($rootScope, $state, Config, eventsBus, Model, Eddie) {
      $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        $rootScope.title = Config.app_title_prefix + toState.title;

        if (toParams.user != null) {
          var user = null;
          var userName = toParams.user;
          if (userName != null) {
            user = _(Config.users).find(function (u) {
              return u.name == userName
            });
          }
          if (user != null) {
            Eddie.init(user);
          } else {
            console.log('Invalid user name ' + userName);
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
