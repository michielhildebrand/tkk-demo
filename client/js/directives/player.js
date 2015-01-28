'use strict';

angular.module('app.player', []).directive('player',
  ['$interval', '$timeout', '$log', 'Eddie', 'eventsBus', 'Model', playerDirective]);

function playerDirective($interval, $timeout, $log, Eddie, eventsBus, Model) {
  return {
    restrict: 'E',
    scope: {
      second: '='
    },
    replace: false,
    link: function (scope, element, attrs) {
      scope.paused = true;
      var video = null;
      var previousCurrentTime = null;
      var player = document.getElementsByTagName("video")[0];

      scope.$watch(
        function () {
          return Model.getVideo();
        },
        function (newVideo) {
          video = newVideo;
          if (newVideo != null) updatePlayer(newVideo, Model.getTime());
        }
      );

      // update the duration based on the video metadata
      $(player).on('loadedmetadata', function (metadata) {
        if(video) {
          video.duration = metadata.target.duration * 1000; //In milliseconds  
        }
      });

      function updatePlayer(video, time) {
        stopTimePublisher();
        scope.paused = true;
        
        debug('Video changed with video: ' + video.id + ', and time: ' + time);
        player.poster = video.poster;

        // This does not work on iOS
        player.src = video.src;
        player.load();

        seek(time);

        // on a TV we play straightaway.
        if(scope.second) {
          player.play();
        }
        
      }

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
              if (msg.time) {
                player.currentTime = msg.time / 1000; //In seconds
              }
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
              seek(msg.time);
              //player.currentTime = msg.time / 1000; //Seconds
              break;
            case 'dispose':
              player.pause();
              player.src = '';
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
        scope.playerTimePublisher = $interval(publishCurrentTime, 1000);
      }

      function stopTimePublisher() {
        if(scope.playerTimePublisher) {
          $interval.cancel(scope.playerTimePublisher);
        }
      }

      function seek(time, posterBlock) {
        if(!posterBlock) {
          player.poster = shotUrl(video, time);
        }
        //console.log(player.seekable.end(0), time/1000);
        if(video.duration && time > video.duration) {
          debug('skip seek to end'+time+' > duration '+duration);
        }
        if(player.seekable.length>0 && time/1000 <= player.seekable.end(0)) {
          player.currentTime = time/1000;
          publishCurrentTime();
        } else {
          eventsBus.publish('player-time', "loading");
          setTimeout(function() { seek(time, true) }, 1000);
        }
      }

      function publishCurrentTime() {
        // if (player.readyState<4) {
        //   eventsBus.publish('player-time', "loading");
        // }
        //if (!player.currentTime) {
       	//	eventsBus.publish('player-time', "loading");
        //}
        //else {
          var currentTime = player.currentTime;
          currentTime *= 1000; //In milliseconds
          if (currentTime !== previousCurrentTime) {
            previousCurrentTime = currentTime;
            if (scope.second) {
              Eddie.putLou({target: 'player-time', data: currentTime});
            } else {
              eventsBus.publish('player-time', currentTime);
            }
          }
        //}
      }



      scope.$on("$destroy", function () {
        debug('Destroy player');
        stopTimePublisher();
        unsubscribePlayer();
        destroyPlayer();
      });

      function destroyPlayer() {
        player.src = '';
        player.pause();
        delete($(player));
        $(element[0]).empty();
      }

      function shotUrl(video, time) {
        var d = new Date(time);
          d.setSeconds(d.getSeconds());
          var h = d.getHours() - 1;
          var m = d.getMinutes();
          var s = d.getSeconds();
          return video.shots + "/h/" + h + "/m/" + m + "/sec" + s + ".jpg";
      }

      function debug(msg) {
        $log.debug('[Player (directive)] ' + msg)
      }
    },
    templateUrl: 'partials/directives/player.html'
  }
}
