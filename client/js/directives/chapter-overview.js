'use strict';

angular.module('app.chapter-overview', []).directive('chapterOverview', ['$location', 'Model', playerControlsDirective]);

function playerControlsDirective($location, Model) {
  return {
    restrict: 'E',
    scope: {
      'video': '='
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
      $scope.getDuration = function (ch) {
          console.log(ch);
          return moment.utc(parseInt(ch.duration)).format("m:ss");
      } 

      $scope.play = function (chIndex) {
        $location.path('/play/' + $scope.video.id + '/' + chIndex);
      };
    },
    templateUrl: 'partials/directives/chapter-overview.html'
  }
}
