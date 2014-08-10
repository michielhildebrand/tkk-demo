'use strict';

angular.module('app.bookmarking', []).directive('bookmarking', ['Data', bookmarkingDirective]);

function bookmarkingDirective(Data) {
  return {
    restrict: 'E',
    scope: {
      'chapter': '='
    },
    replace: false,
    link: function (scope, element, attrs) {

    },
    controller: function ($scope, $element) {
      $scope.bookmark = function () {
        var chId = $scope.chapter.id;
        var bookmarks = !isBookmarked() ? Data.bookmark(chId) : Data.unbookmark(chId);
        sendToBookmark(bookmarks);
      };

      $scope.bookmarkStatus = function () {
        return isBookmarked() ? "Unbookmark it" : "Bookmark it";
      };

      function isBookmarked() {
        if ($scope.chapter) {
          return _.contains(Data.getBookmarks(), $scope.chapter.id);
        } else {
          return false;
        }
      }

      function sendToBookmark(action) {
        send({target: 'bookmark', data: action});
      }

      function send(msg) {
        eddie.putLou('ngproxy', JSON.stringify(msg));
      }
    },
    templateUrl: 'partials/bookmarking.html'
  }
}
