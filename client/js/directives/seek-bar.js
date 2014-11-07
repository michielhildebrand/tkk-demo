'use strict';

angular.module('app.seek-bar', []).directive('seekBar', ['$rootScope', '$log', 'eventsBus', 'Model', seekBarDirective]);

function seekBarDirective($rootScope, $log, eventsBus, Model) {
  return {
    restrict: 'E',
    replace: false,
    scope: {},
    link: function (scope, element, attrs) {
      scope.duration = '0';
      scope.current = '0';

      scope.startLapse = '00:00';
      scope.endLapse = '00:00';

      scope.progresses = [];

      scope.$watch(
        function () {
          return Model.getVideo();
        },
        function (newVideo) {
          if (newVideo != null) {
            scope.duration = newVideo.duration;
            calculateProgresses(newVideo);
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

      function calculateProgresses(video) {
        scope.progresses = _(video.chapters).map(function(ch, index) {
          var chDuration;
          if (index == video.chapters.length - 1) { //if last one
            chDuration = video.duration - ch.startTime;
          } else {
            chDuration = video.chapters[index + 1].startTime - ch.startTime;
          }
          var v = (chDuration * 100) / video.duration;
          return {title: ch.title, duration: v};
        });
      }

      function updateBar(millis) {
        scope.current = millis;
        scope.endLapse = moment(scope.duration - millis).format('mm:ss');
        scope.startLapse = moment(millis).format('mm:ss');
      }

      function syncCurrentTime(milliseconds) {
        //Model.seek(milliseconds);
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
