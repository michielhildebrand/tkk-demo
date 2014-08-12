'use strict';

angular.module('app.chapter-list', []).directive('chapterList', ['$location', 'Data', playerControlsDirective]);

function playerControlsDirective($location, Data) {
  return {
    restrict: 'E',
    scope: {
      'chapters': '='
    },
    replace: false,
    link: function (scope, element, attrs) {

    },
    controller: function ($scope, $element) {
      $scope.getTitle = function (ch) {
        return ch.title + " @ " + (ch.startTime / 1000) + "s";
      };

      $scope.getShot = function (ch) {
        var d = new Date(ch.startTime);
        var h = d.getHours() - 1;
        var m = d.getMinutes();
        var s = d.getSeconds();
        return Data.getVideo().shots + "/h/" + h + "/m/" + m + "/sec" + s + ".jpg";
      };

      $scope.play = function (chIndex) {
        $location.path('/play/' + chIndex);
      };
    },
    templateUrl: 'partials/directives/chapter-list.html'
  }
}
