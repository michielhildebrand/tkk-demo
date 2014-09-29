'use strict';

angular.module('app.chapter-history', []).directive('chapterHistory', ['$state', 'Model', chapterHistoryDirective]);

function chapterHistoryDirective($state, Model) {
  return {
    restrict: 'E',
    scope: {},
    replace: false,
    require: '^chapterEnrich',
    link: function (scope, element, attrs, chapterEnrichCtrl) {
      scope.history = Model.getHistory();

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
    templateUrl: 'partials/directives/chapter-history.html'
  }
}
