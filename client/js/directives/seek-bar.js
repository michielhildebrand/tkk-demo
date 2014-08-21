'use strict';

angular.module('app.seek-bar', []).directive('seekBar', ['Model', seekBarDirective]);

function seekBarDirective(Model) {
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
            $scope.current = newChapter.startTime;

            $scope.endLapse = moment($scope.duration - $scope.current).format('mm:ss');
            $scope.startLapse = moment($scope.current).format('mm:ss');
          }
        }
      );

    },
    templateUrl: 'partials/directives/seek-bar.html'
  }
}
