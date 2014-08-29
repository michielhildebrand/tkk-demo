'use strict';

angular.module('app.chapter-about', []).directive('chapterAbout', ['entityProxy', chapterAboutDirective]);

function chapterAboutDirective(entityProxy) {
  return {
    restrict: 'E',
    scope: {
      'video': '=',
      'chapter': '=',
      'metadata': '='
    },
    replace: false,
    link: function (scope, element, attrs) {
      scope.loading = false;

      scope.crumb = [];
      var answers = {};

      loadChapterInformation();

      // The chapter information are shown in the first information card
      function loadChapterInformation() {
        var chapterTitle = scope.chapter.title;
        answers[chapterTitle] = {
          label: [
            {value: chapterTitle}
          ],
          thumb: [chapterPicture()],
          metadata: scope.metadata
        };

        var chapterEntity = {value: chapterTitle, uri: ''};
        callEntityProxy(chapterEntity);
      }

      //TODO replace with chapter artwork picture (special object)
      function chapterPicture() {
        var d = new Date(scope.chapter.startTime);
        var h = d.getHours() - 1;
        var m = d.getMinutes();
        var s = d.getSeconds();
        return scope.video.shots + "/h/" + h + "/m/" + m + "/sec" + s + ".jpg";
      }

      function callEntityProxy(e) {
        updateCrumb(e);

        scope.loading = true;
        if (!_(answers).has(e.value)) {
          entityProxy.get({loc: e.uri}, function (r) {
            scope.proxyAnswer = _.property(e.uri)(r);
            answers[e.value] = scope.proxyAnswer;

            scope.loading = false;
          });
        } else {
          scope.proxyAnswer = _.property(e.value)(answers);
          scope.loading = false;
        }
      }

      function updateCrumb(e) {
        var index = _(scope.crumb).pluck('value').indexOf(e.value);
        if (index != -1) {
          scope.crumb = _(scope.crumb).first(index + 1);
        } else {
          scope.crumb.push(e)
        }
      }

      scope.proxy = function (entity) {
        callEntityProxy(entity)
      };
    },
    templateUrl: 'partials/directives/chapter-about.html'
  }
}
