'use strict';

angular.module('app.chapter-about', []).directive('chapterAbout', ['entityProxy', 'Model', chapterAboutDirective]);

function chapterAboutDirective(entityProxy, Model) {
  return {
    restrict: 'E',
    scope: {
      metadata: '='
    },
    require: '^chapterEnrich',
    replace: false,
    link: function (scope, element, attrs, chapterEnrichCtrl) {
//      scope.loading = false;

      var answers = {};

//      scope.$watch('metadata', function (newMetadata) {
//        if (newMetadata != null) {
//          scope.crumb = [];
//          loadChapterInformation(Model.getChapter(), newMetadata);
//        }
//      });
//
//      // The chapter information are shown in the first information card
//      function loadChapterInformation(ch, meta) {
//        var chapterTitle = ch.title;
//        answers[chapterTitle] = {
//          label: [
//            {value: chapterTitle}
//          ],
//          thumb: [chapterPicture(ch)],
//          metadata: meta
//        };
//
//        var chapterEntity = {value: chapterTitle, uri: ''};
//        callEntityProxy(chapterEntity);
//      }
//
//      //TODO replace with chapter artwork picture (special object)
//      function chapterPicture(ch) {
//        var d = new Date(ch.startTime);
//        var h = d.getHours() - 1;
//        var m = d.getMinutes();
//        var s = d.getSeconds();
//        return Model.getVideo().shots + "/h/" + h + "/m/" + m + "/sec" + s + ".jpg";
//      }

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
