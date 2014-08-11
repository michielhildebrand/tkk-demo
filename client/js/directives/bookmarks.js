'use strict';

angular.module('app.bookmarks', []).directive('bookmarks', ['Data', bookmarksDirective]);

function bookmarksDirective(Data) {
  return {
    restrict: 'E',
    replace: false,
    link: function (scope, element, attrs) {

      scope.$watch(
        function () {
          return Data.getBookmarks();
        },
        function (newBookmarks) {
          if (newBookmarks != null) scope.bookmarks = newBookmarks;
        }
      );

    },
    controller: function ($scope, $element) {

    },
    templateUrl: 'partials/bookmarks.html'
  }
}
