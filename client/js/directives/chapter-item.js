'use strict';

angular.module('app.chapter-item', []).directive('chapterItem', ['$location', 'Model', chapterItemDirective]);

function chapterItemDirective($location, Model) {
  return {
    restrict: 'E',
    scope: {
      'video': '=',
      'chapter': '=',
      'index': '='
    },
    replace: false,
    link: function (scope, element, attrs) {
      scope.isSelected = function() {
        return Model.getChapterIndex() == scope.index;
      };

      scope.getShot = function () {
        var d = new Date(scope.chapter.startTime);
        var h = d.getHours() - 1;
        var m = d.getMinutes();
        var s = d.getSeconds();
        return scope.video.shots + "/h/" + h + "/m/" + m + "/sec" + s + ".jpg";
      };

      scope.getDuration = function () {
        return moment.utc(parseInt(scope.chapter.duration)).format("m:ss");
      };

      scope.play = function () {
        $location.path('/play/' + Model.getUser() + '/' + scope.video.id + '/' + scope.index);
      };
    },
    templateUrl: 'partials/directives/chapter-item.html'
  }
}
