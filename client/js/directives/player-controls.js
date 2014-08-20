'use strict';

angular.module('app.player-controls', []).directive('playerControls', ['$location', 'Model', playerControlsDirective]);

function playerControlsDirective($location, Model) {
  return {
    restrict: 'E',
    replace: false,
    link: function (scope, element, attrs) {

    },
    controller: function ($scope, $element) {
      $scope.play = true;
      $scope.mute = false;
      $scope.volume = '1'; //from 0 to 1, and range treats value as strings
      $scope.previousVolume = $scope.volume;

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
          $scope.previousVolume = $scope.volume;
          $scope.volume = '0';
          sendToPlayer({action: 'mute'});
        } else {
          $scope.volume = $scope.previousVolume;
          sendToPlayer({action: 'unmute'});
        }
      };

      $scope.setVolume = function($event) {
        var value = $event.target.value;
        sendToPlayer({action: 'volume', value: value});
      };

      $scope.prevChapter = function() {
        jump(-1);
      };
      $scope.nextChapter = function() {
        jump(1);
      };

      function jump(delta) {
        $location.path('/play/' + (Model.getChapterIndex() + delta));
      }

      $scope.$watch(
        function () {
          return Model.getVideo();
        },
        function (newVideo) {
          if (newVideo != null) {
            $scope.isFirst = Model.isFirstChapter();
            $scope.isLast = Model.isLastChapter();
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
