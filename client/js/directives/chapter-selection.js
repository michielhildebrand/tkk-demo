'use strict';

angular.module('app.chapter-selection', []).directive('chapterSelection', ['$state', 'Model',chapterSectionDirective]);

function chapterSectionDirective($state, Model) {
  return {
    restrict: 'E',
    scope: {
      'video': '='
    },
    replace: false,
    link: function (scope, element, attrs) {
      scope.isSelected = function(index) {
        return Model.getChapterIndex() == index;
      };
 
      scope.select = function (index) {
        if ($state.current.name != 'play') {
          $state.go('play', {user: Model.getUser(), videoId: scope.video.id, idx: index});
        } else {
          Model.setChapterIndex(index);
        }
      };
    },
    templateUrl: 'partials/directives/chapter-selection.html'
  }
}
