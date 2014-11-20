'use strict';

angular.module('app.bookmark', []).directive('bookmark', ['Eddie', 'Model', 'Tracker', bookmarkDirective]);

function bookmarkDirective(Eddie, Model, Tracker) {
  return {
    restrict: 'E',
    replace: false,
    scope: {
      video: '=',
      chapter: '='
    },
    link: function (scope, element, attrs) {
      scope.$watchCollection(
        function () {
          return Model.getBookmarks();
        },
        function () {
            scope.bookmarkStatus = isBookmarked();
        }
      );

      scope.bookmark = function (e) {
        var id = compositeId();
        var currentBookmarks = scope.bookmarkStatus ? Model.unbookmark(id) : Model.bookmark(id);
        Tracker.collect({action: 'user_bookmark', id: id});
        sendToBookmark(currentBookmarks);
        e.stopPropagation();
      };

      function isBookmarked() {
        return _.contains(Model.getBookmarks(), compositeId());
      }

      function compositeId() {
        var videoId = scope.video ? scope.video.id : Model.getVideo().id;
        var chapterId = scope.chapter ? scope.chapter.id : Model.getChapter().id;
        return videoId + '_' + chapterId;
      }

      function sendToBookmark(b) {
        Eddie.putLou({target: 'bookmark', data: b});
      }
    },
    templateUrl: 'partials/directives/bookmark.html'
  }
}
