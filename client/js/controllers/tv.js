'use strict';

angular.module('TvCtrl', []).controller('TvCtrl', ['$scope', 'eventsBus', 'Model', tvCtrl]);

function tvCtrl($scope, eventsBus, Model) {
  $scope.second = true;
  $scope.beaming = false;

  $scope.full = function() {
    if (screenfull.enabled) {
      screenfull.request();
    }
  };

  var playVideo = function (msg) {
    Model.play(msg.video, msg.chapter);

    $scope.$$phase || $scope.$apply();
  };

  eventsBus.subscribe('tv', playVideo);
}
