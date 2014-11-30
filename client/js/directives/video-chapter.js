'use strict';

angular.module('app.video-chapter', []).directive('videoChapter', ['$log', videoChapterDirective]);

function videoChapterDirective($log) {
  return {
    restrict: 'E',
    scope: {
      'video': '=',
      'chapter': '=',
      'showVideoTitle': '='
    },
    replace: false,
    link: function (scope, element, attrs) {

      scope.getShot = function () {
        if (scope.chapter.image) {
          return scope.chapter.image;
        }
        else if (scope.video && scope.video.shots) {
          var d = new Date(scope.chapter.startTime);
          d.setSeconds(d.getSeconds() + 2); // +2 because the shots are a bit of
          var h = d.getHours() - 1;
          var m = d.getMinutes();
          var s = d.getSeconds();
          return scope.video.shots + "/h/" + h + "/m/" + m + "/sec" + s + ".jpg";
        } else {
          return "";
        }
      };

      scope.getDuration = function () {
        return moment.utc(parseInt(scope.chapter.duration)).format("m:ss");
      };

      function debug(msg) {
        $log.debug('[Video Chapter (directive)] ' + msg)
      }
    },
    templateUrl: 'partials/directives/video-chapter.html'
  }
}
