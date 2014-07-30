'use strict';

angular.module('TvCtrl', []).controller('TvCtrl', ['$scope', 'eventsBus', tvCtrl]);

function tvCtrl($scope, eventsBus) {
  $scope.second = true;

  var processMsg = function (tvMsg) {
    $scope.video = {
      poster: tvMsg.poster,
      src: tvMsg.src,
      currentTime: tvMsg.currentTime
    };

    $scope.$$phase || $scope.$apply();
  };

  eventsBus.subscribe($scope, 'tv', processMsg);
}
