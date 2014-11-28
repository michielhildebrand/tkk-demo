'use strict';

angular.module('app.player-controls', []).directive('playerControls', ['$log', 'Eddie', 'eventsBus', 'Model', 'Tracker', playerControlsDirective]);

function playerControlsDirective($log, Eddie, eventsBus, Model, Tracker) {
  return {
    restrict: 'E',
    replace: false,
    scope: {},
    link: function (scope, element, attrs) {
      scope.play = true;
      scope.mute = false;
      scope.volume = '1'; //from 0 to 1, and range treats value as strings
      scope.previousVolume = scope.volume;
      scope.fullscreen = false;
      scope.beaming = Model.isBeaming();

      scope.togglePlay = function () {
        scope.play = !scope.play;
        if (scope.play) {
          sendToPlayer({action: 'play'});
          Tracker.collect({action: 'player_play', id: Model.getVideo().id, time: currentTime});
        } else {
          sendToPlayer({action: 'pause'});
          Tracker.collect({action: 'player_pause', id: Model.getVideo().id, time: currentTime});
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

      scope.toggleFullscreen = function () {
        if (!scope.beaming) {
          scope.fullscreen = !scope.fullscreen;
          sendToLocalPlayer({action: 'fullscreen', value: scope.fullscreen});
        }
      };

      scope.toggleBeam = function () {
        scope.beaming = Model.setBeaming(!scope.beaming);
        if (scope.beaming) {
          sendToLocalPlayer({action: 'pause'});
          sendToRemoteTv({action: 'set-video', video: Model.getVideo().id, chapter: Model.getChapterIndex(), time: currentTime});
        } else {
          sendToRemoteTv({action: 'stop-beaming'});
          sendToLocalPlayer({action: 'play', time: currentTime});
          scope.play = true;
        }
      };

      var currentTime = 0;
      var updateCurrentTime = function (t) {
        //debug('Update current time: ' + t);
        currentTime = t
      };
      eventsBus.subscribe('player-time', updateCurrentTime);

      function sendToPlayer(a) {
        if (!scope.beaming) {
          sendToLocalPlayer(a);
        } else {
          sendToRemoteTv(a);
        }
      }

      function sendToLocalPlayer(a) {
        eventsBus.publish('player', a);
      }

      function sendToRemoteTv(a) {
        Eddie.putLou({target: 'tv', data: a});
      }

      function debug(msg) {
        $log.debug('[Player Controls (directive)] ' + msg)
      }
    },
    templateUrl: 'partials/directives/player-controls.html'
  }
}
