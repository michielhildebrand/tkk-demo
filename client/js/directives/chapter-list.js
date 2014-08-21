'use strict';

angular.module('app.chapter-list', []).directive('chapterList', ['$location', 'Model', playerControlsDirective]);

function playerControlsDirective($location, Model) {
  return {
    restrict: 'E',
    scope: {
      'video': '=',
      'chapters': '='
    },
    replace: false,
    link: function (scope, element, attrs) {

    },
    controller: function ($scope, $element) {
      $scope.getShot = function (ch) {
        var d = new Date(ch.startTime);
        var h = d.getHours() - 1;
        var m = d.getMinutes();
        var s = d.getSeconds();
        return $scope.video.shots + "/h/" + h + "/m/" + m + "/sec" + s + ".jpg";
      };

      $scope.play = function (chId) {
        $location.path('/play/' + $scope.video.id + '/' + chId);
      };
    },
    templateUrl: 'partials/directives/chapter-list.html'
  }
}
