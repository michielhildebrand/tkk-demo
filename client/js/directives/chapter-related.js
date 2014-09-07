'use strict';

angular.module('app.chapter-related', []).directive('chapterRelated', ['Model', chapterRelatedDirective]);

function chapterRelatedDirective(Model) {
  return {
    restrict: 'E',
    scope: {},
    replace: false,
    link: function (scope, element, attrs) {
      scope.$watch(
        function () {
          return Model.getVideos();
        },
        function (newVideos) {
          if (newVideos.length > 0) {
            scope.relatedVideos = newVideos;
          }
        }
      );

      scope.getShot = function (video, chapter) {
        var d = new Date(chapter.startTime);
        var h = d.getHours() - 1;
        var m = d.getMinutes();
        var s = d.getSeconds();
        return video.shots + "/h/" + h + "/m/" + m + "/sec" + s + ".jpg";
      };

    },
    templateUrl: 'partials/directives/chapter-related.html'
  }
}
