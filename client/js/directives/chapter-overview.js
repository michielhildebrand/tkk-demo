'use strict';

angular.module('app.chapter-overview', []).directive('chapterOverview', ['$location', 'Model', chapterOverviewDirective]);

function chapterOverviewDirective($location, Model) {
  return {
    restrict: 'E',
    scope: {
      'video': '='
    },
    replace: false,
    link: function (scope, element, attrs) {

    },
    controller: function ($scope, $element) {
      $scope.isSelected = function(chIndex) {
        console.log(chIndex);
        return Model.getChapterIndex() == chIndex;
      };

      $scope.getShot = function (ch) {
        var d = new Date(ch.startTime);
        var h = d.getHours() - 1;
        var m = d.getMinutes();
        var s = d.getSeconds();
        return $scope.video.shots + "/h/" + h + "/m/" + m + "/sec" + s + ".jpg";
      };

      $scope.getDuration = function (ch) {
        return moment.utc(parseInt(ch.duration)).format("m:ss");
      };

      $scope.play = function (chIndex) {
        $location.path('/play/' + $scope.video.id + '/' + chIndex);
      };
    },
    templateUrl: 'partials/directives/chapter-overview.html'
  }
}
