'use strict';

angular.module('app.chapter-item', []).directive('chapterItem', ['$location', 'Model', chapterItemDirective]);

function chapterItemDirective($location, Model) {
  return {
    restrict: 'E',
    scope: {
      'video': '=',
      'chapter': '='
    },
    replace: false,
    link: function (scope, element, attrs) {

    },
    controller: function ($scope, $element) {
      $scope.getShot = function () {
        var d = new Date($scope.chapter.startTime);
        var h = d.getHours() - 1;
        var m = d.getMinutes();
        var s = d.getSeconds();
        return $scope.video.shots + "/h/" + h + "/m/" + m + "/sec" + s + ".jpg";
      };

      $scope.getDuration = function () {
        return moment.utc(parseInt($scope.chapter.duration)).format("m:ss");
      };

      $scope.play = function (chIndex) {
        $location.path('/play/' + $scope.video.id + '/' + chIndex);
      };
    },
    templateUrl: 'partials/directives/chapter-item.html'
  }
}
