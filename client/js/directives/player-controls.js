'use strict';

angular.module('app.player-controls', []).directive('playerControls', ['Eddie', 'eventsBus', 'Model', playerControlsDirective]);

function playerControlsDirective(Eddie, eventsBus, Model) {
  return {
    restrict: 'E',
    replace: false,
    scope: {
      beaming: '=',
      enrich: '='
    },
    link: function (scope, element, attrs) {
      scope.play = true;
      scope.mute = false;
      scope.volume = '1'; //from 0 to 1, and range treats value as strings
      scope.previousVolume = scope.volume;
      scope.fullscreen = false;
      scope.isFirst = false;
      scope.isLast = false;

      scope.togglePlay = function () {
        scope.play = !scope.play;
        if (scope.play) {
          sendToPlayer({action: 'play'});
        } else {
          sendToPlayer({action: 'pause'});
        }
      };

      scope.toggleMute = function () {
        scope.mute = !scope.mute;
        if (scope.mute) {
          scope.previousVolume = scope.volume;
          scope.volume = '0';
          sendToPlayer({action: 'mute'});
        } else {
          scope.volume = scope.previousVolume;
          sendToPlayer({action: 'unmute'});
        }
      };

      scope.setVolume = function ($event) {
        var value = $event.target.value;
        sendToPlayer({action: 'volume', value: value});
      };

      scope.toggleFullscreen = function() {
        scope.fullscreen = !scope.fullscreen;
        sendToPlayer({action: 'fullscreen', value:scope.fullscreen});
      };

      scope.prevChapter = function () {
        jump(-1);
      };
      scope.nextChapter = function () {
        jump(1);
      };

      function jump(delta) {
        sendToPlayer({action: 'set-chapter', value: Model.getChapterIndex() + delta});
      }

      scope.toggleBeam = function () {
        scope.beaming = !scope.beaming;
        if (scope.beaming) {
          sendToRemoteTv({action: 'play', video: Model.getVideo().id, chapter: Model.getChapterIndex()});
          sendToRemotePlayer({action: 'play'})
        } else {
          scope.play = true;
          sendToRemoteTv({action: 'stop-beaming'});
        }
      };

      scope.toggleEnrich = function () {
        scope.enrich = !scope.enrich;
      };

      scope.$watch(
        function () {
          return Model.getChapter();
        },
        function (newChapter) {
          if (newChapter != null) {
            scope.isFirst = Model.isFirstChapter();
            scope.isLast = Model.isLastChapter();
          }
        }
      );

      function sendToPlayer(a) {
        if (!scope.beaming) {
          sendToLocalPlayer(a);
        } else {
          sendToRemotePlayer(a);
        }
      }
      function sendToLocalPlayer(a) {
        console.log('local msg to player', a);
        eventsBus.publish('player', a);
      }
      function sendToRemotePlayer(a) {
        console.log('remote msg to player', a);
        Eddie.putLou({target: 'player', data: a});
      }

      function sendToRemoteTv(a) {
        console.log('remote msg to tv', a);
        Eddie.putLou({target: 'tv', data: a});
      }
    },
    templateUrl: 'partials/directives/player-controls.html'
  }
}
