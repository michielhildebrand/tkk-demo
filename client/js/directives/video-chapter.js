'use strict';

angular.module('app.video-chapter', []).directive('videoChapter', ['Eddie', 'Model', 'Tracker', videoChapterDirective]);

function videoChapterDirective(Eddie, Model, Tracker) {
  return {
    restrict: 'E',
    scope: {
      'video': '=',
      'chapter': '='
    },
    replace: false,
    link: function (scope, element, attrs) {
      scope.data = Model.underlyingData;

      scope.$watchCollection('data', function () {
          if (Model.getBookmarks().length > 0) {
            scope.bookmarkStatus = isBookmarked();
          }
        }
      );

      scope.getShot = function () {
        var d = new Date(scope.chapter.startTime);
        d.setSeconds(d.getSeconds() + 2); // +2 because the shots are a bit of
        var h = d.getHours() - 1;
        var m = d.getMinutes();
        var s = d.getSeconds();
        return scope.video.shots + "/h/" + h + "/m/" + m + "/sec" + s + ".jpg";
      };

      scope.getDuration = function () {
        return moment.utc(parseInt(scope.chapter.duration)).format("m:ss");
      };

      scope.bookmark = function (e) {
        var id = compositeId();
        var currentBookmarks = isBookmarked() ? Model.unbookmark(id) : Model.bookmark(id);
        Tracker.collect({action: 'user_bookmark', id: id});
        sendToBookmark(currentBookmarks);
        e.stopPropagation();
      };

      function isBookmarked() {
        return _.contains(Model.getBookmarks(), compositeId());
      }

      function compositeId(chapterId) {
        return scope.video.id + '_' + scope.chapter.id;
      }

      function sendToBookmark(b) {
        Eddie.putLou({target: 'bookmark', data: b});
      }
    },
    templateUrl: 'partials/directives/video-chapter.html'
  }
}
