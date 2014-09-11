'use strict';

angular.module('app.chapter-selection', []).directive('chapterSelection', ['$state', 'Eddie', 'Model',chapterSectionDirective]);

function chapterSectionDirective($state, Eddie, Model) {
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
          sendToPlayer({action: 'set-chapter', idx: index});
        }
      };
      
      function sendToPlayer(action) {
        Eddie.putLou({target: 'player', data: action});
      }
    },
    templateUrl: 'partials/directives/chapter-selection.html'
  }
}
