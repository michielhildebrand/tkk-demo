'use strict';

angular.module('app.chapter-selection', []).directive('chapterSelection',
  ['$location', '$log', 'eventsBus', 'Eddie', 'Model', chapterSectionDirective]);

function chapterSectionDirective($location, $log, eventsBus, Eddie, Model) {
  return {
    restrict: 'E',
    scope: {
      'video': '='
    },
    replace: false,
    link: function (scope, element, attrs) {
      scope.isSelected = function (chId) {
        return Model.getChapter().id == chId;
      };

      scope.select = function (chId) {
        debug('Select chapter: ' + chId + ' of current video: ' + scope.video.id);
        Model.setChapterId(chId);
        $location.search('chId', chId);
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

      function debug(msg) {
        $log.debug('[ChapterSelection (directive)] ' + msg)
      }
    },
    templateUrl: 'partials/directives/chapter-selection.html'
  }
}
