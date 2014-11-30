'use strict';

angular.module('app.seek-bar', []).directive('seekBar', ['$rootScope', '$log', 'eventsBus', 'Model', 'Config', seekBarDirective]);

function seekBarDirective($rootScope, $log, eventsBus, Model, Config) {
  return {
    restrict: 'E',
    replace: false,
    scope: {},
    link: function (scope, element, attrs) {
      scope.duration = '0';
      scope.current = '0';

      scope.startLapse = '00:00';
      scope.endLapse = '00:00';

      scope.$watch(
        function () {
          var v = Model.getVideo();
          return v ? v.duration : null;
        },
        function (newDuration) {
          if (newDuration != null) {
            scope.duration = newDuration;
          }
        }
      );
      scope.$watch(
        function () {
          return Model.getChapter();
        },
        function (newChapter) {
          if (newChapter != null) {
            updateBar(newChapter.startTime);
          }
        }
      );

      function updateBar(millis) {
        scope.current = millis;
        scope.endLapse = moment(scope.duration - millis).format('mm:ss');
        scope.startLapse = moment(millis).format('mm:ss');
      }

      function syncCurrentTime(milliseconds) {
        if (Config.synchronize_model) Model.sync(milliseconds);
        updateBar(milliseconds);
        $rootScope.$$phase || $rootScope.$apply();
      }

      var unsubscribePlayerTime = eventsBus.subscribe('player-time', syncCurrentTime);

      scope.$on("$destroy", function () {
        debug('destroy seek bar');
        unsubscribePlayerTime();
      });

      function debug(msg) {
        $log.debug('[Seek Bar (directive)] ' + msg)
      }
    },
    templateUrl: 'partials/directives/seek-bar.html'
  }
}
