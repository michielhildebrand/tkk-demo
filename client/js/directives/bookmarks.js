'use strict';

angular.module('app.bookmarks', []).directive('bookmarks', ['eventsBus', 'Data', bookmarksDirective]);

function bookmarksDirective(eventsBus, Data) {
  return {
    restrict: 'E',
    replace: false,
    link: function (scope, element, attrs) {

    },
    controller: function ($scope, $element) {
      $scope.$watch(
        function () {
          return Data.getBookmarks();
        },
        function (newBookmarks) {
          if (newBookmarks != null) $scope.bookmarks = newBookmarks;
        }
      );

      var syncBookmarks = function(bookmarks) {
        _.each(bookmarks, function(b) {
          Data.bookmark(b);
        });

        $scope.$$phase || $scope.$apply();
      };

      eventsBus.subscribe('bookmark', syncBookmarks);
    },
    templateUrl: 'partials/directives/bookmarks.html'
  }
}
