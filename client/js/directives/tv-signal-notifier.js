'use strict';

angular.module('app.tv-signal-notifier', []).directive('tvSignalNotifier',
  ['$state', '$log', '$timeout', 'Model', 'eventsBus', tvSignalNotifierDirective]);

function tvSignalNotifierDirective($state, $log, $timeout, Model, eventsBus) {
  return {
    restrict: 'E',
    scope: {
      'videos': '='
    },
    replace: false,
    link: function (scope, element, attrs) {
      scope.tvIsPlaying = false;

      scope.$watch('videos', function (videos) {
        if (videos != null) {
          var v = videos[0];
          var ch = v.chapters[0];
          scope.video = v;
          scope.exploreLink = $state.href('play', {user: Model.getUser(), videoId: v.id, chId: ch.id, mode: 'lookup'});
        }
      });

      var notifierTimer;
      var updateNotifier = function (t) {
        if (angular.isDefined(notifierTimer)) {
          $timeout.cancel(notifierTimer);
          notifierTimer = undefined;
        }

        scope.tvIsPlaying = true;

        notifierTimer = $timeout(function () {
          debug('Expected a video signal within 3 seconds, but did not arrive.');
          scope.tvIsPlaying = false
        }, 3000);
      };
      eventsBus.subscribe('player-time', updateNotifier);

      function debug(msg) {
        $log.debug('[Tv Signal Notifier (directive)] ' + msg)
      }
    },
    templateUrl: 'partials/directives/tv-signal-notifier.html'
  }
}
