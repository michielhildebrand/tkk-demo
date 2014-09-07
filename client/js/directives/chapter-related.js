'use strict';

angular.module('app.chapter-related', []).directive('chapterRelated', ['Model', chapterRelatedDirective]);

function chapterRelatedDirective(Model) {
  return {
    restrict: 'E',
    scope: {},
    replace: false,
    require: '^chapterEnrich',
    link: function (scope, element, attrs, chapterEnrichCtrl) {
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
        return shot(video, chapter);
      };

      //TODO replace with chapter artwork picture (special object)
      function shot(v, ch) {
        var d = new Date(ch.startTime);
        var h = d.getHours() - 1;
        var m = d.getMinutes();
        var s = d.getSeconds();
        return v.shots + "/h/" + h + "/m/" + m + "/sec" + s + ".jpg";
      }

      scope.nav = function(v, ch) {
        var content = {
          label: [
            {value: ch.chapterTitle}
          ],
          thumb: [shot(v, ch)],
          metadata: chapterEnrichCtrl.extractMetadata(ch)
        };
        chapterEnrichCtrl.setContent(content);
      };

    },
    templateUrl: 'partials/directives/chapter-related.html'
  }
}
