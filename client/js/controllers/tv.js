'use strict';

angular.module('TvCtrl', []).controller('TvCtrl', ['$scope', '$log', 'eventsBus', 'Model', tvCtrl]);

function tvCtrl($scope, $log, eventsBus, Model) {
  $scope.second = true;

  $scope.full = function () {
    if (screenfull.enabled) {
      screenfull.request();
    }
  };

  var playVideo = function (msg) {
    debug('Event: ' + JSON.stringify(msg));
    var a = msg.action;
    if (a) {
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
          debug('Unknown action: ' + a);
      }
    } else {
      debug('Unknown message');
    }
  };

  function debug(msg) {
    $log.debug('[TV (ctrl)] ' + msg)
  }

  eventsBus.subscribe('tv', playVideo);
}
