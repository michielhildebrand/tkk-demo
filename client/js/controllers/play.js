'use strict';

angular.module('PlayCtrl', []).controller('PlayCtrl', ['$scope', '$state', '$location', 'Eddie', 'Model', 'Tracker', playCtrl]);

function playCtrl($scope, $state, $location, Eddie, Model, Tracker) {
  $scope.second = false;
  $scope.enrich = false;
  $scope.playContentHeight = 0;
  $scope.beaming = Model.isBeaming();
  $scope.tracking = Tracker.enabled();

  $scope.$watch(
    function () {
      return Model.getVideos();
    },
    function (newVideos) {
      if (newVideos.length > 0) {
        playVideo($state.params.videoId, $state.params.idx);
      }
    }
  );

  $scope.$on('$locationChangeSuccess', function(event, nextLocation, currentLocation) {
    $scope.enrich = false;
    var currentParams = $location.search();
    playVideo(currentParams.videoId, currentParams.idx);
  });

  function playVideo(videoId, chIdx) {
    Model.play(videoId, chIdx);
    $scope.video = Model.getVideo();
    $scope.playContentHeight = angular.element('#play-content')[0].offsetHeight;

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

  function sendToRemoteTv(a) {
    Eddie.putLou({target: 'tv', data: a});
  }
}
