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
          updateStatus();
        }
      );

//      scope.$watch('[video, chapter]', function (newValue, oldValue) {
//        if (newValue[0] != null && newValue[1] != null) updateStatus();
//      }, true);

      scope.bookmark = function (e) {
        var id = compositeId();
        var currentBookmarks = [];
        if (scope.bookmarkStatus) {
          currentBookmarks = Model.unbookmark(id);
        } else {
          currentBookmarks = Model.bookmark(id);
          Tracker.collect({action: 'user_bookmark', id: scope.video.id, time: Model.getTime()});
        }
        sendToBookmark(currentBookmarks);
        e.stopPropagation();
      };

      function updateStatus() {
        scope.bookmarkStatus = isBookmarked();
      }

      function isBookmarked() {
        return _.contains(Model.getBookmarks(), compositeId());
      }

      function compositeId() {
        return scope.video.id + '_' + scope.chapter.id;
      }

      function sendToBookmark(b) {
        Eddie.putLou({target: 'bookmark', data: b});
      }
    },
    templateUrl: 'partials/directives/bookmark.html'
  }
}
