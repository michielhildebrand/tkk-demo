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
        console.log(e);
        var content = {
          title:[e.value],
          url:[e.uri]
        };
        if (!_(answers).has(e.value)) {
          entityProxy.get({loc: e.uri}, function (r) {
             _(content).extend(_.property(e.uri)(r));
            chapterEnrichCtrl.setContent(content, e);
            answers[e.value] = content;
          });
        } else {
          chapterEnrichCtrl.setContent(_.property(e.value)(answers), e);
        }
      };

    },
    templateUrl: 'partials/directives/chapter-about.html'
  }
}
