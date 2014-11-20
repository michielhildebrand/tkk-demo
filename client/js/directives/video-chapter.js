'use strict';

angular.module('app.video-chapter', []).directive('videoChapter', ['Eddie', 'Model', 'Tracker', videoChapterDirective]);

function videoChapterDirective(Eddie, Model, Tracker) {
  return {
    restrict: 'E',
    scope: {
      'video': '=',
      'chapter': '='
    },
    replace: false,
    link: function (scope, element, attrs) {

      scope.getShot = function () {
        var d = new Date(scope.chapter.startTime);
        d.setSeconds(d.getSeconds() + 2); // +2 because the shots are a bit of
        var h = d.getHours() - 1;
        var m = d.getMinutes();
        var s = d.getSeconds();
        return scope.video.shots + "/h/" + h + "/m/" + m + "/sec" + s + ".jpg";
      };

      scope.getDuration = function () {
        return moment.utc(parseInt(scope.chapter.duration)).format("m:ss");
      };

    },
    templateUrl: 'partials/directives/video-chapter.html'
  }
}
