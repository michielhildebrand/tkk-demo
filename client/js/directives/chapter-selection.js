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
      scope.getShot = function (index) {
        var d = new Date(scope.video.chapters[index].startTime);
        var h = d.getHours() - 1;
        var m = d.getMinutes();
        var s = d.getSeconds();
        s=s+2;
        if(s>60) {
          m++;
          s=s-60;
        }
        return scope.video.shots + "/h/" + h + "/m/" + m + "/sec" + s + ".jpg";
      };
      scope.select = function (index) {
        
        if ($state.current.name != 'play') {
          $state.go('play', {user: Model.getUser(), videoId: scope.video.id, idx: index});
        } else {
          sendToPlayer({action: 'set-chapter', value: index});
        }
      };
      
      function sendToPlayer(action) {
        Eddie.putLou({target: 'player', data: action});
      }
    },
    templateUrl: 'partials/directives/chapter-selection.html'
  }
}
