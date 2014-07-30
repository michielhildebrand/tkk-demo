'use strict';

angular.module('app.player-controls', []).directive('playerControls', ['eventsBus', playerControlsDirective]);

function playerControlsDirective(eventsBus) {
  return {
    restrict: 'A',
    replace: false,
    link: function (scope, element, attrs) {


    },
    controller: function ($scope, $element) {
      $scope.play = true;
      $scope.mute = false;

      $scope.togglePlay = function () {
        $scope.play = !$scope.play;
        if ($scope.play) {
          send({action: 'play'});
        } else {
          send({action: 'pause'});
        }
      };

      $scope.playLabel = function () {
        return ($scope.play) ? "Pause" : "Play";
      };

      $scope.toggleMute = function () {
        $scope.mute = !$scope.mute;
        if ($scope.mute) {
          send({action: 'mute'});
        } else {
          send({action: 'unmute'});
        }
      };

      $scope.muteLabel = function () {
        return ($scope.mute) ? "Unmute" : "Mute";
      };

      $scope.setVolume = function($event) {
        var value = $event.target.value;
        send({action: 'volume', value: value});
      };

      function send(action) {
        var playerMsg = JSON.stringify({target: 'player', data: action});
        eddie.putLou('ngproxy', playerMsg);
      }
    },
    templateUrl: 'partials/player-controls.html'
  }
}
