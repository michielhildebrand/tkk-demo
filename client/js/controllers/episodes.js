'use strict';

angular.module('EpisodesCtrl', []).controller('EpisodesCtrl', ['$scope', '$state', 'Model', episodesCtrl]);

function episodesCtrl($scope, $state, Model) {

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

}
