'use strict';

angular.module('PlayCtrl', []).controller('PlayCtrl', ['$scope', '$state', '$location', '$log', '$ionicSideMenuDelegate', 'Eddie', 'Model', 'Config', 'Tracker', playCtrl]);

function playCtrl($scope, $state, $location, $log, $ionicSideMenuDelegate, Eddie, Model, Config, Tracker) {
  $scope.mode = $state.params.mode;

  $scope.second = false;
  $scope.enrich = false;
  $scope.lookupMode = Config.lookupMode;
  $scope.controls = {hidden: false}; // this needs to be an object for the children to change it
  $scope.beaming = Model.isBeaming();
  $scope.tracking = Tracker.enabled();

  $scope.$watch(
    function () {
      return Model.getVideos();
    },
    function (newVideos) {
      if (newVideos.length > 0) {
        debug(newVideos.length + ' new videos available.');
        playVideo($state.params.videoId, $state.params.chId);
      }
    }
  );

  $scope.$on('$locationChangeSuccess', function (event, nextLocation, currentLocation) {
    debug('Changed location');
    $scope.enrich = false;
    var currentParams = $location.search();
    playVideo(currentParams.videoId, currentParams.chId);
  });

  function playVideo(videoId, chId) {
    debug('Play video ' + videoId + ' and chapter ' + chId);
    Model.play(videoId, chId);
    $scope.video = Model.getVideo();

    if ($scope.beaming) {
      sendToRemoteTv({action: 'set-video', video: videoId, chapter: chId});
    }
  }

  $scope.$watch(
    function () {
      return Model.isBeaming();
    },
    function (isBeaming) {
      $scope.beaming = isBeaming;
    }
  );

  $scope.goToMain = function () {
    Tracker.collect({action: 'player_stop', id: $scope.video.id, time: Model.getTime()});
    $state.go('episodes', {user: Model.getUser()});
  };

  $scope.toggleTracking = function () {
    $scope.tracking = Tracker.toggle();
  };

  $scope.setActiveMode = function (mode) {
    $scope.mode = mode;
    $location.search('mode', mode);
    if (!$scope.beaming) {
      if (mode === 'watch') {
        Tracker.collect({action: 'player_play', id: Model.getVideo().id, time: Model.getTime()});
      } else {
        Tracker.collect({action: 'player_pause', id: Model.getVideo().id, time: Model.getTime()});
      }
    }
    if (mode === 'explore' || mode === 'lookup') {
      Tracker.collect({action: 'player_enrich', id: Model.getVideo().id, time: Model.getTime()});
    }
  };

  $scope.isActiveMode = function (mode) {
    return mode == $scope.mode;
  };

  $scope.getActiveMode = function () {
    return $scope.mode;
  };

  $scope.controlsHidden = function () {
    return $scope.controls.hidden && $scope.mode == 'watch';
  };

  $scope.toggleLeft = function () {
    $ionicSideMenuDelegate.toggleLeft();
  };

  function sendToRemoteTv(a) {
    Eddie.putLou({target: 'tv', data: a});
  }

  function debug(msg) {
    $log.debug('[Play (Ctrl)] ' + msg)
  }
}