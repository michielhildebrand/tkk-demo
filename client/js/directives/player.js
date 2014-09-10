'use strict';

angular.module('app.player', []).directive('player', ['$interval', 'Eddie', 'eventsBus', 'Model', playerDirective]);

function playerDirective($interval, Eddie, eventsBus, Model) {
  return {
    restrict: 'E',
    scope: {
      second: '=',
      beaming: '='
    },
    replace: false,
    link: function (scope, element, attrs) {
      scope.paused = false;
      scope.previousCurrentTime = 0;

      var player = element[0].children.player;
      var source = player.children.source;

      function updatePlayer(video, time) {
        //console.log('update player', video, time);
        player.poster = video.poster;
        source.src = video.src;
        player.load();
        if (!scope.paused) {
          player.play();
        }

        $(player).on('loadedmetadata', function (metadata) {
          /*var actualRatio = metadata.target.videoWidth / metadata.target.videoHeight;
          var targetRatio = 1.777777; //$(player).width()/$(player).height();
          var adjustmentRatio =  targetRatio/actualRatio;
          $(player).css("transform", "scaleX(" + adjustmentRatio + ")");
          */
          player.currentTime = time;
          startTimePublisher();
        });
      }

      scope.$watch(
        function () {
          return Model.getVideo();
        },
        function (newVideo) {
          if (newVideo != null) updatePlayer(newVideo, Model.getTime());
        }
      );

      if (scope.second) {
        angular.element(element).on("click", function () {
          // To make fullscreen work the request has to sent from inside a short running user-generated event handler.
          if (screenfull.enabled) {
            screenfull.request();
          }
        });
      }

      var executeAction = function (msg) {
        if (!scope.beaming) {
          var a = msg.action;
          if (a) {
            //console.log('action ' + a);
            switch (a) {
              case 'set-chapter':
                Model.setChapterIndex(msg.value);
                player.currentTime = Model.getTime();
                break;
              case 'play':
                player.play();
                startTimePublisher();
                scope.paused = false;
                break;
              case 'pause':
                player.pause();
                stopTimePublisher();
                scope.paused = true;
                break;
              case 'mute':
                player.muted = true;
                break;
              case 'unmute':
                player.muted = false;
                break;
              case 'volume':
                player.volume = msg.value;
                break;
              case 'fullscreen':
                if(msg.value) {
                  player.webkitRequestFullScreen();
                } else {
                  document.webkitCancelFullScreen();
                }  
                break;  
              default:
                console.log('Unknown action: ' + a);
            }
          } else {
            console.log('Unknown message: ' + msg);
          }
        }
      };
      var unsubscribePlayer = eventsBus.subscribe('player', executeAction);

      function startTimePublisher() {
        scope.playerTimePublisher = $interval(publishCurrentTime, 1000);
      }

      function stopTimePublisher() {
        $interval.cancel(scope.playerTimePublisher);
      }

      function publishCurrentTime() {
        var currentTime = player.currentTime;
        if (currentTime != scope.previousCurrentTime) {
          scope.previousCurrentTime = currentTime;
          if (scope.second) {
            Eddie.putLou({target: 'player-time', data: currentTime});
          } else {
            eventsBus.publish('player-time', currentTime);
          }
        }
      }

      scope.$watch('beaming', function (beaming) {
        if (beaming) {
          //TODO: stop publishing time
          player.pause();
        } else {
          //TODO: restart publishing time
        }
      });

      scope.$on("$destroy", function () {
        console.log('destroy player');
        stopTimePublisher();
        unsubscribePlayer();
        destroyPlayer();
      });

      function destroyPlayer() {
        source.src = '';
        delete($(source));
        player.pause();
        delete($(player));
        $(element[0]).empty();
      }
    },
    templateUrl: 'partials/directives/player.html'
  }
}
