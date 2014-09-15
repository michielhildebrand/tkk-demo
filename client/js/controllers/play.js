'use strict';

angular.module('PlayCtrl', []).controller('PlayCtrl', ['$scope', '$state', '$location', 'eventsBus', 'Eddie', 'Model', 'Tracker', playCtrl]);

function playCtrl($scope, $state, $location, eventsBus, Eddie, Model, Tracker) {
  $scope.second = false;
  $scope.enrich = false;
  $scope.beaming = Model.isBeaming();

  $scope.playContentHeight = 0;

  $scope.$watch(
    function () {
      return Model.getVideos();
    },
    function (newVideos) {
      if (newVideos.length > 0) {
        var videoId = $state.params.videoId;
        var chIdx = $state.params.idx;

        Model.play(videoId, chIdx);
        $scope.video = Model.getVideo();
        $scope.playContentHeight = angular.element('#play-content')[0].offsetHeight;

        if ($scope.beaming) {
          sendToRemoteTv({action: 'set-video', video: videoId, chapter: chIdx});
        }
      }
    }
  );

  $scope.$watch(
    function () {
      return Model.getChapterIndex();
    },
    function (newIndex, oldIndex) {
      if (newIndex != null && oldIndex != null && newIndex != oldIndex) {
        sendToPlayer({action: 'set-time', time: Model.getTime()});
        $location.search('idx', newIndex);
      }
    }
  );

  $scope.$watch(
    function () {
      return Model.isBeaming();
    },
    function (isBeaming) {
      $scope.beaming = isBeaming;
    }
  );

  $scope.goToMain = function () {
    Tracker.collect({action: 'player_stop', id: $scope.video, time: Model.getTime()});
    $state.go('episodes', {user: Model.getUser()});
  };

  function sendToPlayer(a) {
    if (!$scope.beaming) {
      sendToLocalPlayer(a);
    } else {
      sendToRemotePlayer(a);
    }
  }
  function sendToLocalPlayer(a) {
    eventsBus.publish('player', a);
  }
  function sendToRemotePlayer(a) {
    Eddie.putLou({target: 'player', data: a});
  }

  function sendToRemoteTv(a) {
    Eddie.putLou({target: 'tv', data: a});
  }
}
