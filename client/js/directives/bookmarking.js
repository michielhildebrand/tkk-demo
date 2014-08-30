'use strict';

angular.module('app.bookmarking', []).directive('bookmarking', ['Eddie', 'Model', bookmarkingDirective]);

function bookmarkingDirective(Eddie, Model) {
  return {
    restrict: 'E',
    scope: {},
    replace: false,
    link: function (scope, element, attrs) {
      scope.data = Model.underlyingData;

      scope.bookmark = function () {
        var id = compositeId();
        var currentBookmarks = isBookmarked() ? Model.unbookmark(id) : Model.bookmark(id);
        sendToBookmark(currentBookmarks);
      };

      scope.$watchCollection('data', function () {
          if (Model.getBookmarks().length > 0 && Model.getChapter() != null) {
            scope.bookmarkStatus = isBookmarked();
          }
        }
      );

      function isBookmarked() {
        return _.contains(Model.getBookmarks(), compositeId());
      }

      function compositeId() {
        return Model.getVideo().id + '_' + Model.getChapter().id;
      }

      function sendToBookmark(b) {
        Eddie.putLou({target: 'bookmark', data: b});
      }
    },
    templateUrl: 'partials/directives/bookmarking.html'
  }
}
