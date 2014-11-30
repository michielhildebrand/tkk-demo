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
        $scope.latestVideos = _(newVideos).first(3);
        $scope.videos = newVideos;
      }
    }
  );

  $scope.playFirstChapter = function (video) {
    $state.go('play', {user: Model.getUser(), videoId: video.id, chId: video.chapters[0].id, mode: 'watch'});
  };

  $scope.signOut = function () {
    Model.signOut();
    Eddie.destroy();
    $state.go('select');
  }
}
