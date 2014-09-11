'use strict';

angular.module('TvCtrl', []).controller('TvCtrl', ['$scope', 'eventsBus', 'Model', tvCtrl]);

function tvCtrl($scope, eventsBus, Model) {
  $scope.second = true;

  $scope.full = function() {
    if (screenfull.enabled) {
      screenfull.request();
    }
  };

  var playVideo = function (msg) {
    switch (msg.action) {
      case 'set-video':
        Model.play(msg.video, msg.chapter, msg.time);
        $scope.$$phase || $scope.$apply();
        break;
      case 'play':
        eventsBus.publish('player', {action: 'play', time: msg.time});
        break;
      case 'stop-beaming':
        Model.reset();
        eventsBus.publish('player', {action: 'dispose'});
        break;
    }
  };

  eventsBus.subscribe('tv', playVideo);
}
