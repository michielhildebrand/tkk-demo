'use strict';

angular.module('TvCtrl', []).controller('TvCtrl', ['$scope', 'eventsBus', 'Data', tvCtrl]);

function tvCtrl($scope, eventsBus, Data) {
  $scope.second = true;

  var playVideo = function (msg) {
    Data.play(msg.video, msg.chapter);

    $scope.$$phase || $scope.$apply();
  };

  eventsBus.subscribe('tv', playVideo);
}
