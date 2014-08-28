'use strict';

angular.module('app.player', []).directive('player', ['eddie', 'eventsBus', 'Model', playerDirective]);

function playerDirective(eddie, eventsBus, Model) {
  return {
    restrict: 'E',
    scope: {
      second: '=',
      beaming: '='
    },
    replace: false,
    link: function (scope, element, attrs) {
      scope.paused = false;

      if (scope.second) {
        angular.element(element).on("click", function () {
          // To make fullscreen work the request has to sent from inside a short running user-generated event handler.
          if (screenfull.enabled) {
            screenfull.request();
          }
        });
      }

      function updatePlayer(newVideo, time) {
        var player = element[0].children.player;
        var source = player.children.source;

        player.poster = newVideo.poster;
        source.src = newVideo.src;
        player.load();
        if (!scope.paused) {
          player.play();
        }

        $(player).on('loadedmetadata', function (metadata) {
            var actualRatio = metadata.target.videoWidth/metadata.target.videoHeight;
            var targetRatio = 1.777777;//$(player).width()/$(player).height();
            var adjustmentRatio = targetRatio/actualRatio;
            $(player).css("transform","scaleX("+adjustmentRatio+")");
            player.currentTime = time;
        });
      }

      scope.$watch('beaming', function (beaming) {
        if (beaming) {
          element[0].children.player.pause();
        }
      });

      scope.$watch(
        function () {
          return Model.getVideo();
        },
        function (newVideo) {
          if (newVideo != null) updatePlayer(newVideo, Model.getTime());
        }
      );
    },
    controller: function ($scope, $element, $interval) {
      var executeAction = function (msg) {
        if (!$scope.beaming) {
          var player = $element[0].children.player;
          var a = msg.action;
          if (a) {
            //console.log('action ' + a);
            switch (a) {
              case 'play':
                player.play();
                $scope.paused = false;
                break;
              case 'pause':
                player.pause();
                $scope.paused = true;
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
              default:
                console.log('Unknown action: ' + a);
            }
          } else {
            console.log('Unknown message: ' + msg);
          }
        }
      };
      eventsBus.subscribe('player', executeAction);

      var intervalPromise = $interval(publishCurrentTime, 1000);

      function publishCurrentTime() {
        if (!$scope.beaming) {
          var time = $element[0].children.player.currentTime;
          if (time != 0) eddie.putLou({target: 'player-time', data: time});
        }
      }

      $scope.$on("$destroy", function () {
        $interval.cancel(intervalPromise);
      });
    },
    templateUrl: 'partials/directives/player.html'
  }
}
