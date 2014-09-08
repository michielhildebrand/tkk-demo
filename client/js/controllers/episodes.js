'use strict';

angular.module('EpisodesCtrl', []).controller('EpisodesCtrl', ['$scope', '$state', 'Model', 'Eddie', episodesCtrl]);

function episodesCtrl($scope, $state, Model, Eddie) {
  $scope.user = Model.getUser();

  $scope.$watch(
    function () {
      return Model.getVideos();
    },
    function (newVideos) {
      if (newVideos.length > 0) {
        $scope.latestVideo = newVideos[0];
        $scope.remainingVideos = newVideos.slice(1);
      }
    }
  );

  $scope.playFirstChapter = function (videoId) {
    $state.go('play', {user: Model.getUser(), videoId: videoId, idx: 0});
  };

  $scope.signOut = function() {
    Eddie.destroy();
    $state.go('select');
  }
}
