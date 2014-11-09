'use strict';

angular.module('PlayCtrl', []).controller('PlayCtrl', ['$scope', '$state', '$location', '$log', 'Eddie', 'Model', 'Tracker', playCtrl]);

function playCtrl($scope, $state, $location, $log, Eddie, Model, Tracker) {
  $scope.mode = 'watch';
  $scope.second = false;
  $scope.enrich = false;
  $scope.controls = true;
  $scope.playContentHeight = 0;
  $scope.beaming = Model.isBeaming();
  $scope.tracking = Tracker.enabled();

  $scope.$watch(
    function () {
      return Model.getVideos();
    },
    function (newVideos) {
      if (newVideos.length > 0) {
        debug(newVideos.length + ' new videos available.');
        playVideo($state.params.videoId, $state.params.idx);
      }
    }
  );

  $scope.$on('$locationChangeSuccess', function(event, nextLocation, currentLocation) {
    debug('changed location');
    $scope.enrich = false;
    var currentParams = $location.search();
    playVideo(currentParams.videoId, currentParams.idx);
  });

  function playVideo(videoId, chIdx) {
    debug('Play video ' + videoId + ' on ' + chIdx);
    Model.play(videoId, chIdx);
    $scope.video = Model.getVideo();
    $scope.playContentHeight = angular.element('body')[0].offsetHeight;

    if ($scope.beaming) {
      sendToRemoteTv({action: 'set-video', video: videoId, chapter: chIdx});
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

  $scope.setActiveMode = function(mode) {
    $scope.mode = mode;
  };

  $scope.isActiveMode = function(mode) {
    return mode == $scope.mode;
  }

  $scope.getActiveMode = function() {
    return $scope.mode;
  }

  $scope.controlsHidden = function() {
    return !$scope.controls && $scope.mode == 'watch';
  };

  function sendToRemoteTv(a) {
    Eddie.putLou({target: 'tv', data: a});
  }

  function debug(msg) {
    $log.debug('[Play (Ctrl)] ' + msg)
  }
}

function ContentController($scope, $ionicSideMenuDelegate) {
  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
}