'use strict';

angular.module('app.chapter-about', []).directive('chapterAbout', ['entityProxy', 'Model', chapterAboutDirective]);

function chapterAboutDirective(entityProxy, Model) {
  return {
    restrict: 'E',
    scope: {},
    require: '^chapterEnrich',
    replace: false,
    link: function (scope, element, attrs, chapterEnrichCtrl) {
      var answers = {};

      scope.$watch(
        function () {
          return Model.getChapter()
        },
        function (newChapter) {
          if (newChapter != null) {
            scope.metadata = chapterEnrichCtrl.extractMetadata(newChapter);
          }
        }
      );

      scope.nav = function (e) {
        chapterEnrichCtrl.setCrumb(e);

        if (!_(answers).has(e.value)) {
          entityProxy.get({loc: e.uri}, function (r) {
            var answer = _.property(e.uri)(r);
            chapterEnrichCtrl.setContent(answer);
            answers[e.value] = answer;
          });
        } else {
          chapterEnrichCtrl.setContent(_.property(e.value)(answers));
        }
      };

    },
    templateUrl: 'partials/directives/chapter-about.html'
  }
}
