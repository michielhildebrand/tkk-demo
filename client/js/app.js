'use strict';

var linkedTvApp = angular.module('linkedTvApp', [
  'ui.router',
  'ionic',
  '720kb.socialshare',
  'youtube-embed',

  'Config',

  'SelectCtrl',
  'EpisodesCtrl',
  'PlayCtrl',
  'TvCtrl',
  'AdminCtrl',
  'VideoAdminCtrl',

  'app.player',
  'app.player-controls',
  'app.video-overview',
  'app.video-chapter',
  'app.chapter-selection',
  'app.bookmarks',
  'app.bookmark',
  'app.information-card',
  'app.entity-slider',
  'app.entity-slide',
  'app.seek-bar',
  'app.chapter-enrich',
  'app.dimension-list',
  'app.tv-signal-notifier',
  'app.visible-on-load',

  'Eddie',
  'Model',
  'EventsBus',
  'EntityProxy',
  'LinkedtvSparql',
  'EuropeanaApi',
  'IRApi',
  'Tracker',
  'ContentFiltering',
  'DocumentProxy',
  'EditorTool',

  'Modeller'
]);

linkedTvApp.config(['$stateProvider', '$urlRouterProvider',
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
        url: '/play/:user?videoId&chId&mode',
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
      }).
      state('admin', {
        url: '/admin',
        title: '- Admin',
        templateUrl: 'partials/controllers/admin.html',
        controller: 'AdminCtrl'
      }).
      state('videoAdmin', {
        url: '/admin/:videoId',
        title: '- Admin',
        templateUrl: 'partials/controllers/video-admin.html',
        controller: 'VideoAdminCtrl'
      });
  }
]).config(['$ionicTabsConfig', '$logProvider', 'Config', function ($ionicTabsConfig, $logProvider, Config) {
  // Override the Android platform default to add "tabs-striped" class to "ion-tabs" elements.
  $ionicTabsConfig.type = '';

  $logProvider.debugEnabled(Config.debug_enabled);
}
]).run(['$rootScope', '$state', '$log', '$http', '$q', '$templateCache', 'Config', 'eventsBus', 'Model', 'Eddie', 'Tracker',
    function ($rootScope, $state, $log, $http, $q, $templateCache, Config, eventsBus, Model, Eddie, Tracker) {
      // disable template caching 
      // TODO should be only in "dev" mode
      $rootScope.$on('$routeChangeStart', function(event, next, current) {
        if (typeof(current) !== 'undefined'){
            $templateCache.remove(current.templateUrl);
        }
      });

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
            var screenId = Eddie.init(user);
            Tracker.init(user, screenId);
            Model.signIn(userName);
          } else {
            debug('Invalid user name ' + userName);
            $state.go('select');
          }
        }
      });

      $rootScope.$on("$destroy", function () {
        Model.signOut();
        Eddie.destroy();
      });

      var syncBookmarks = function (bookmarks) {
        debug('Load ' + bookmarks.length + ' bookmarks.');
        _.each(bookmarks, function (b) {
          Model.bookmark(b);
        });
        $rootScope.$$phase || $rootScope.$apply();
      };
      eventsBus.subscribe('bookmark', syncBookmarks);

      function loadVideos(seeds) {
        var videos = seeds.map(function (s) {
          return $http.get('video/' + s.id + '.json', {cache:false})
            .success(function (v) {return v;})
            .catch(angular.noop);
        });
        $q.all(videos).then(function (videos) {
          videos = _.chain(videos).filter(function (v) {return v}).map(function (v) {return v.data}).value();
          debug('Load ' + videos.length + ' videos.');
          Model.setVideos(videos);
          $rootScope.$$phase || $rootScope.$apply();
        })
      }
      $http.get(Config.seed, {cache:false}).success(loadVideos);

      function debug(msg) {
        $log.debug('[App] ' + msg)
      }
    }
  ]
);
