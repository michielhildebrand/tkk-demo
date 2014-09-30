'use strict';

angular.module('app.chapter-related', []).directive('chapterRelated', ['$state', 'Model', chapterRelatedDirective]);

function chapterRelatedDirective($state, Model) {
  return {
    restrict: 'E',
    scope: {},
    replace: false,
    require: '^chapterEnrich',
    link: function (scope, element, attrs, chapterEnrichCtrl) {
      var selectedRelated = '';

      scope.$watch(
        function () {
          return Model.getVideos();
        },
        function (newVideos) {
          if (newVideos.length > 0) {
            scope.relatedVideos = _(newVideos).filter(function (v) {return v.id != Model.getVideo().id});
            selectedRelated = '';
          }
        }
      );

      scope.isSelected = function(v, ch) {
        return v.id + '_' + ch.id == selectedRelated;
      };

      //TODO replace with chapter artwork picture (special object)
      function shot(v, ch) {
        var d = new Date(ch.startTime);
        d.setSeconds(d.getSeconds() + 2); // +2 because the shots are a bit of
        var h = d.getHours() - 1;
        var m = d.getMinutes();
        var s = d.getSeconds();
        return v.shots + "/h/" + h + "/m/" + m + "/sec" + s + ".jpg";
      }

      scope.nav = function (v, ch, chapterIdx) {
        selectedRelated = v.id + '_' + ch.id;
        var content = {
          title: [ch.title],
          thumb: [shot(v, ch)],
          metadata: chapterEnrichCtrl.extractMetadata(ch),
          playChapter: [{
            value: ch.title,
            uri: $state.href('play', {user: Model.getUser(), videoId: v.id, idx: chapterIdx}).substring(1)
          }]
        };
        chapterEnrichCtrl.setContent(content);
      };

    },
    templateUrl: 'partials/directives/chapter-related.html'
  }
}
