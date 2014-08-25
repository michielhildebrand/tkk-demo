'use strict';

angular.module('app.seek-bar', []).directive('seekBar', ['eventsBus', 'Model', seekBarDirective]);

function seekBarDirective(eventsBus, Model) {
  return {
    restrict: 'E',
    replace: false,
    link: function (scope, element, attrs) {

    },
    controller: function ($scope, $element) {
      $scope.duration = '0';
      $scope.current = '0';

      $scope.startLapse = '00:00';
      $scope.endLapse = '00:00';

      $scope.$watch(
        function () {
          return Model.getVideo();
        },
        function (newVideo) {
          if (newVideo != null) {
            $scope.duration = newVideo.duration;
          }
        }
      );
      $scope.$watch(
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
        $scope.current = millis;
        $scope.endLapse = moment($scope.duration - millis).format('mm:ss');
        $scope.startLapse = moment(millis).format('mm:ss');
      }

      function syncCurrentTime(t) {
        if (t != 0) updateBar(t * 1000);

        $scope.$$phase || $scope.$apply();
      }

      eventsBus.subscribe('player-time', syncCurrentTime);

    },
    templateUrl: 'partials/directives/seek-bar.html'
  }
}
