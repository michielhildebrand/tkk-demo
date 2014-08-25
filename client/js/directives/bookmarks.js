'use strict';

angular.module('app.bookmarks', []).directive('bookmarks', ['Model', bookmarksDirective]);

function bookmarksDirective(Model) {
  return {
    restrict: 'E',
    replace: false,
    link: function (scope, element, attrs) {

    },
    controller: function ($scope, $element) {
      $scope.$watch(
        function () {
          return Model.getBookmarks();
        },
        function (newBookmarks) {
          if (newBookmarks != null) $scope.bookmarks = newBookmarks;
        }
      );
    },
    templateUrl: 'partials/directives/bookmarks.html'
  }
}
