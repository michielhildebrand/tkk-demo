'use strict';

angular.module('app.player-controls', []).directive('playerControls', ['$location', 'Data', playerControlsDirective]);

function playerControlsDirective($location, Data) {
  return {
    restrict: 'E',
    replace: false,
    link: function (scope, element, attrs) {

    },
    controller: function ($scope, $element) {
      $scope.play = true;
      $scope.mute = false;

      $scope.isFirst = false;
      $scope.isLast = false;

      $scope.togglePlay = function () {
        $scope.play = !$scope.play;
        if ($scope.play) {
          sendToPlayer({action: 'play'});
        } else {
          sendToPlayer({action: 'pause'});
        }
      };

      $scope.toggleMute = function () {
        $scope.mute = !$scope.mute;
        if ($scope.mute) {
          sendToPlayer({action: 'mute'});
        } else {
          sendToPlayer({action: 'unmute'});
        }
      };

      $scope.setVolume = function($event) {
        var value = $event.target.value;
        sendToPlayer({action: 'volume', value: value});
      };

      $scope.prevChapter = function() {
        $location.path('/play/' + (Data.getChapter() - 1));
      };
      $scope.nextChapter = function() {
        $location.path('/play/' + (Data.getChapter() + 1));
      };

      $scope.$watch(
        function () {
          return Data.getVideo();
        },
        function (newVideo) {
          if (newVideo != null) {
            $scope.isFirst = Data.isFirstChapter();
            $scope.isLast = Data.isLastChapter();
          }
        }
      );

      function sendToPlayer(action) {
        send({target: 'player', data: action});
      }
      function send(msg) {
        eddie.putLou('ngproxy', JSON.stringify(msg));
      }
    },
    templateUrl: 'partials/directives/player-controls.html'
  }
}
