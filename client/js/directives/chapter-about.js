'use strict';

angular.module('app.chapter-about', []).directive('chapterAbout', ['entityProxy', chapterAboutDirective]);

function chapterAboutDirective(entityProxy) {
  return {
    restrict: 'E',
    scope: {
      metadata: '='
    },
    require: '^chapterEnrich',
    replace: false,
    link: function (scope, element, attrs, chapterEnrichCtrl) {
      var answers = {};

      scope.nav = function(e) {
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
