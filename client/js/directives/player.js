'use strict';

angular.module('app.player', []).directive('player', ['$interval', '$log', 'Eddie', 'eventsBus', 'Model', playerDirective]);

function playerDirective($interval, $log, Eddie, eventsBus, Model) {
  return {
    restrict: 'E',
    scope: {
      second: '='
    },
    replace: false,
    link: function (scope, element, attrs) {
      scope.paused = false;
      var previousCurrentTime = 0;

      var player = element[0].children.player;
      var source = player.children.source;

      function updatePlayer(video, time) {
        debug('Video changed with video: ' + video.id + ', and time: ' + time);
        player.poster = video.poster;
        source.src = video.src;
        player.load();

        if (!Model.isBeaming()) {
          if (!scope.paused) {
            player.play();
          }

          $(player).on('loadedmetadata', function (metadata) {
            /*
             var actualRatio = metadata.target.videoWidth / metadata.target.videoHeight;
             var targetRatio = 1.777777; //$(player).width()/$(player).height();
             var adjustmentRatio =  targetRatio/actualRatio;
             $(player).css("transform", "scaleX(" + adjustmentRatio + ")");
             */
            player.currentTime = time / 1000; //Seconds
            startTimePublisher();
          });
        }
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
          if (screenfull.enabled) screenfull.request();
        });
      }

      var executeAction = function (msg) {
        debug('Event: ' + JSON.stringify(msg));
        var a = msg.action;
        if (a) {
          switch (a) {
            case 'play':
              if (msg.time) player.currentTime = msg.time / 1000; //Seconds
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
              if (msg.value) {
                if (screenfull.enabled) screenfull.request(player);
              } else {
                if (screenfull.enabled) screenfull.exit();
              }
              break;
            case 'set-time':
              player.currentTime = msg.time / 1000; //Seconds
              break;
            case 'dispose':
              player.pause();
              source.src = '';
              player.poster = 'img/linkedtv_big.jpg';
              break;
            default:
              debug('Unknown action: ' + a);
          }
        } else {
          debug('Unknown message');
        }
      };
      var unsubscribePlayer = eventsBus.subscribe('player', executeAction);

      function startTimePublisher() {
        scope.playerTimePublisher = $interval(publishCurrentTime, 2000);
      }

      function stopTimePublisher() {
        $interval.cancel(scope.playerTimePublisher);
      }

      function publishCurrentTime() {
        var currentTime = player.currentTime;
        currentTime *= 1000; // Milliseconds
        if (currentTime != previousCurrentTime) {
          previousCurrentTime = currentTime;
          if (scope.second) {
            Eddie.putLou({target: 'player-time', data: currentTime});
          } else {
            eventsBus.publish('player-time', currentTime);
          }
        }
      }

      scope.$on("$destroy", function () {
        debug('Destroy player');
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

      function debug(msg) {
        $log.debug('[Player (directive)] ' + msg)
      }
    },
    templateUrl: 'partials/directives/player.html'
  }
}
