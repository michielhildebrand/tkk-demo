'use strict';

angular.module('app.player-controls', []).directive('playerControls', ['Data', playerControlsDirective]);

function playerControlsDirective(Data) {
  return {
    restrict: 'E',
    replace: false,
    link: function (scope, element, attrs) {

    },
    controller: function ($scope, $element) {
      $scope.play = true;
      $scope.mute = false;

      $scope.togglePlay = function () {
        $scope.play = !$scope.play;
        if ($scope.play) {
          sendToPlayer({action: 'play'});
        } else {
          sendToPlayer({action: 'pause'});
        }
      };

      $scope.playLabel = function () {
        return ($scope.play) ? "Pause" : "Play";
      };

      $scope.toggleMute = function () {
        $scope.mute = !$scope.mute;
        if ($scope.mute) {
          sendToPlayer({action: 'mute'});
        } else {
          sendToPlayer({action: 'unmute'});
        }
      };

      $scope.muteLabel = function () {
        return ($scope.mute) ? "Unmute" : "Mute";
      };

      $scope.setVolume = function($event) {
        var value = $event.target.value;
        sendToPlayer({action: 'volume', value: value});
      };

      $scope.beamIt = function () {
        sendToTv({action: 'play', video: Data.getVideo(), chapter: Data.getChapter()});
      };

      function sendToPlayer(action) {
        send({target: 'player', data: action});
      }
      function sendToTv(action) {
        send({target: 'tv', data: action});
      }
      function send(msg) {
        eddie.putLou('ngproxy', JSON.stringify(msg));
      }
    },
    templateUrl: 'partials/player-controls.html'
  }
}
