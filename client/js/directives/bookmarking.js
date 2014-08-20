'use strict';

angular.module('app.bookmarking', []).directive('bookmarking', ['Model', bookmarkingDirective]);

function bookmarkingDirective(Model) {
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
        var currentBookmarks = isBookmarked() ? Model.unbookmark(chId) : Model.bookmark(chId);
        sendToBookmark(currentBookmarks);
      };

      $scope.bookmarkStatus = function () {
        return isBookmarked();
      };

      function isBookmarked() {
        if ($scope.chapter) {
          return _.contains(Model.getBookmarks(), $scope.chapter.id);
        } else {
          return false;
        }
      }

      function sendToBookmark(b) {
        send({target: 'bookmark', data: b});
      }
      function send(msg) {
        eddie.putLou('ngproxy', JSON.stringify(msg));
      }
    },
    templateUrl: 'partials/directives/bookmarking.html'
  }
}
