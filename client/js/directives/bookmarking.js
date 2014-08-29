'use strict';

angular.module('app.bookmarking', []).directive('bookmarking', ['Eddie', 'Model', bookmarkingDirective]);

function bookmarkingDirective(Eddie, Model) {
  return {
    restrict: 'E',
    scope: {
      'video': '=',
      'chapter': '='
    },
    replace: false,
    link: function (scope, element, attrs) {

    },
    controller: function ($scope, $element) {
      $scope.bookmark = function () {
        var id = compositeId();
        var currentBookmarks = isBookmarked() ? Model.unbookmark(id) : Model.bookmark(id);
        sendToBookmark(currentBookmarks);
      };

      $scope.bookmarkStatus = function () {
        return isBookmarked();
      };

      function isBookmarked() {
        if ($scope.chapter) {
          return _.contains(Model.getBookmarks(), compositeId());
        } else {
          return false;
        }
      }

      function compositeId() {
        return $scope.video.id + '_' + $scope.chapter.id;
      }

      function sendToBookmark(b) {
        Eddie.putLou({target: 'bookmark', data: b});
      }
    },
    templateUrl: 'partials/directives/bookmarking.html'
  }
}
