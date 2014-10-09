'use strict';

angular.module('app.bookmarks', []).directive('bookmarks', ['$state', 'Model', bookmarksDirective]);

function bookmarksDirective($state, Model) {
  return {
    restrict: 'E',
    replace: false,
    scope: {},
    link: function (scope, element, attrs) {
      scope.$watch(
        function () {
          return Model.getBookmarks();
        },
        function (newBookmarks) {
          if (newBookmarks.length > 0) {
            scope.bookmarks = _(newBookmarks).map(function(b) {return findChapter(b)});
            scope.bookmarksByVideo = _(scope.bookmarks).groupBy(function(b) {return b.video.id})
          }
        }
      );

      function findChapter(compositeId) {
        if (Model.getVideos().length > 0) {
          var comp = compositeId.split('_');
          var videoId = comp[0];
          var chapterId = comp[1];

          var video = _(Model.getVideos()).find(function(v) {
            return v.id == videoId;
          });
          var index = 0;
          var chapter = _(video.chapters).find(function(ch, c) {
            index = c;
            return ch.id == chapterId;
          });

          return {
            video : video,
            chapter: chapter,
            index: index
          };
        }
      }

      scope.play = function (bookmark) {
        $state.go('play', {user: Model.getUser(), videoId: bookmark.video.id, idx: bookmark.index});
      };
    },
    templateUrl: 'partials/directives/bookmarks.html'
  }
}
