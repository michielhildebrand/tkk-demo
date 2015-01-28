'use strict';

angular.module('app.player-controls', []).directive('playerControls', ['$log', '$timeout', 'Eddie', 'eventsBus', 'Model', 'Tracker', playerControlsDirective]);

function playerControlsDirective($log, $timeout, Eddie, eventsBus, Model, Tracker) {
  return {
    restrict: 'E',
    replace: false,
    scope: {
      controls: '=',
      mode: '='
    },
    link: function (scope, element, attrs) {
      scope.loading = false;
      scope.play = false;
      scope.mute = false;
      scope.volume = '1'; //from 0 to 1, and range treats value as strings
      scope.previousVolume = scope.volume;
      scope.fullscreen = false;
      scope.beaming = Model.isBeaming();

      var currentTime = 0;

      scope.video = function () {
        return Model.getVideo()
      };
      scope.chapter = function () {
        return Model.getChapter()
      };

      scope.togglePlay = function () {
        scope.play = !scope.play;
        if (scope.play) {
          sendToPlayer({action: 'play'});
          //Tracker.collect({action: 'player_play', id: Model.getVideo().id, time: currentTime});
          Tracker.video('play', Model.getVideo().id, currentTime);
        } else {
          sendToPlayer({action: 'pause'});
          //Tracker.collect({action: 'player_pause', id: Model.getVideo().id, time: currentTime});
          Tracker.video('pause', Model.getVideo().id, currentTime);
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
          sendToRemoteTv({action: 'set-video', video: Model.getVideo().id, chapter: Model.getChapter().id, time: currentTime});
        } else {
          var action = scope.play ? 'play' : 'pause';
          sendToRemoteTv({action: 'stop-beaming'});
          sendToLocalPlayer({action: action, time: currentTime});
        }
      };

      var controlsInterval;
      scope.overlayClick = function () {
        window.clearTimeout(controlsInterval);
        if(scope.controls.hidden) {
          scope.controls.hidden = false;
        } 
        else if(!scope.loading) {
          scope.togglePlay();
        }
        hideControls();
      };
      
      function hideControls() {
        if(scope.play) {
          if(scope.loading) {
            controlsInterval = setTimeout(function() { 
              hideControls()
            }, 500);
          }
          else {
            controlsInterval = setTimeout(function() { 
              if(scope.play) {
                scope.controls.hidden = true;
              } 
            }, 3000);
          }
        }
      }

      var updateCurrentTime = function (t) {
        if(t=="loading") {
          scope.loading = true;
        } else {
          scope.loading = false;
          currentTime = t;
        }
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

      scope.$on("$destroy", function () {
        debug('Destroy player controls');
        window.clearTimeout(controlsInterval);
      });
    },
    templateUrl: 'partials/directives/player-controls.html'
  }
}
