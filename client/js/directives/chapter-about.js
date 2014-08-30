'use strict';

angular.module('app.chapter-about', []).directive('chapterAbout', ['entityProxy', 'Model', chapterAboutDirective]);

function chapterAboutDirective(entityProxy, Model) {
  return {
    restrict: 'E',
    scope: {
      'metadata': '='
    },
    replace: false,
    link: function (scope, element, attrs) {
      scope.loading = false;

      scope.crumb = [];
      var answers = {};

      scope.$watch(
        function () {
          return Model.getChapter();
        },
        function (newChapter) {
          if (newChapter != null) {
            loadChapterInformation(newChapter);
          }
        }
      );

      // The chapter information are shown in the first information card
      function loadChapterInformation(ch) {
        var chapterTitle = ch.title;
        answers[chapterTitle] = {
          label: [
            {value: chapterTitle}
          ],
          thumb: [chapterPicture(ch)],
          metadata: scope.metadata
        };

        var chapterEntity = {value: chapterTitle, uri: ''};
        callEntityProxy(chapterEntity);
      }

      //TODO replace with chapter artwork picture (special object)
      function chapterPicture(ch) {
        var d = new Date(ch.startTime);
        var h = d.getHours() - 1;
        var m = d.getMinutes();
        var s = d.getSeconds();
        return Model.getVideo().shots + "/h/" + h + "/m/" + m + "/sec" + s + ".jpg";
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
