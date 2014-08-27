'use strict';

var tkkDemoApp = angular.module('tkkDemoApp', [
  'ngRoute',
  'ui.bootstrap',

  'HomeCtrl',
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
        title: '',
        templateUrl: 'partials/controllers/home.html',
        controller: 'HomeCtrl'
      }).
      when('/play/:videoId/:chapterIndex', {
        title: ' - Tablet',
        templateUrl: 'partials/controllers/play.html',
        controller: 'PlayCtrl'
      }).
      when('/tv', {
        title: ' - TV',
        templateUrl: 'partials/controllers/tv.html',
        controller: 'TvCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
  }
]).constant('CONFIG', {
  ENTITY_PROXY: 'http://linkedtv.project.cwi.nl/explore/entity_proxy',
  EUROPEANA_API: 'http://europeana.eu/api/v2/search.json'
}).filter('trusted', [
    '$sce',
    function ($sce) {
      return function (url) {
        return $sce.trustAsResourceUrl(url);
      };
    }
  ]
).run(['$location', '$rootScope', 'eddie', 'eventsBus', 'Model',
    function ($location, $rootScope, eddie, eventsBus, Model) {
      $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = 'LinkedTV Culture' + current.$$route.title;
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

      eddie.init();
    }
  ]
);
