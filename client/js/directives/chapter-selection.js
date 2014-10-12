'use strict';

angular.module('app.chapter-selection', []).directive('chapterSelection', ['$location', 'eventsBus', 'Eddie', 'Model',chapterSectionDirective]);

function chapterSectionDirective($location, eventsBus, Eddie, Model) {
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
        Model.setChapterIndex(index);
        $location.search('idx', index);
        sendToPlayer({action: 'set-time', time: Model.getTime()});
      };

      function sendToPlayer(a) {
        if (!Model.isBeaming()) {
          sendToLocalPlayer(a);
        } else {
          sendToRemotePlayer(a);
        }
      }
      function sendToLocalPlayer(a) {
        eventsBus.publish('player', a);
      }
      function sendToRemotePlayer(a) {
        Eddie.putLou({target: 'player', data: a});
      }
    },
    templateUrl: 'partials/directives/chapter-selection.html'
  }
}
