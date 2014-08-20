'use strict';

angular.module('app.player', []).directive('player', ['eventsBus', 'Data', playerDirective]);

function playerDirective(eventsBus, Data) {
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

        $(player).on('loadedmetadata', function () {
          player.currentTime = time;
        });
      }

      scope.$watch('beaming', function(beaming) {
        if (beaming) {
          element[0].children.player.pause();
        }
      });

      scope.$watch(
        function () {
          return Data.getVideo();
        },
        function (newVideo) {
          if (newVideo != null) updatePlayer(newVideo, Data.getTime());
        }
      );
    },
    controller: function ($scope, $element) {
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
    },
    templateUrl: 'partials/directives/player.html'
  }
}
