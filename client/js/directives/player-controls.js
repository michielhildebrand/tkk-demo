'use strict';

angular.module('app.player-controls', []).directive('playerControls', ['eventsBus', playerControlsDirective]);

function playerControlsDirective(eventsBus) {
  return {
    restrict: 'A',
    replace: false,
    link: function (scope, element, attrs) {


    },
    controller: function($scope, $element){
      $scope.play = function () {
        eddie.putLou('')
        console.log('play');
      };
      $scope.pause = function () {
        console.log('pause');
      };
    },
    templateUrl: 'partials/player-controls.html'
  }
}
