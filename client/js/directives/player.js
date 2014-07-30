'use strict';

angular.module('app.player', []).directive('player', ['eventsBus', playerDirective]);

function playerDirective(eventsBus) {
  return {
    restrict: 'A',
    scope: {
      video: '=',
      second: '='
    },
    replace: false,
    link: function (scope, element, attrs) {
      scope.paused = false;

      if (scope.$parent.second) {
        angular.element(element).on("click", function () {
          // To make fullscreen work the request has to sent from inside a short running user-generated event handler.
          if (screenfull.enabled) {
            screenfull.request();
          }
        });
      }

      var updatePlayer = function (newVideo) {
        var player = element.children('video')[0];
        var source = element.children('source')[0];

        player.poster = newVideo.poster;
        source.src = newVideo.src;
        player.load();
        if (!scope.paused) {
          player.play();
        }

        $(player).on('loadedmetadata', function () {
          player.currentTime = newVideo.currentTime;
        });
      };

      scope.$parent.$watch('video', function (video) {
        if (video) updatePlayer(video);
      });
    },
    controller: function ($scope, $element) {
      var executeAction = function (msg) {
        var player = $element.children('player')[0];
        var source = $element.children('source')[0];
        var a = msg.action;
        if (a) {
          console.log('action ' + a);
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
      };
      eventsBus.subscribe($scope, 'player', executeAction);
    },
    templateUrl: 'partials/player.html'
  }
}
