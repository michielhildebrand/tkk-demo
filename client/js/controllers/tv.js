'use strict';

angular.module('TvCtrl', []).controller('TvCtrl', ['$scope', 'eventsBus', 'Model', tvCtrl]);

function tvCtrl($scope, eventsBus, Model) {
  $scope.second = true;

  $scope.full = function () {
    if (screenfull.enabled) {
      screenfull.request();
    }
  };

  var playVideo = function (msg) {
    var a = msg.action;
    if (a) {
      //console.log('action ' + a);
      switch (a) {
        case 'set-video':
          Model.play(msg.video, msg.chapter, msg.time);
          $scope.$$phase || $scope.$apply();
          break;
        case 'stop-beaming':
          Model.resetPlay();
          eventsBus.publish('player', {action: 'dispose'});
          break;
        default:
          console.log('Unknown action: ' + a);
      }
    } else {
      console.log('Unknown message: ' + msg);
    }
  };

  eventsBus.subscribe('tv', playVideo);
}
