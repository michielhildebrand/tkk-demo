'use strict';

angular.module('EpisodesCtrl', []).controller('EpisodesCtrl', ['$scope', '$state', 'Model', 'Eddie', episodesCtrl]);

function episodesCtrl($scope, $state, Model, Eddie) {
  $scope.user = Model.getUser();

  $scope.data = Model.underlyingData;
        
  $scope.$watchCollection('data', function () {
      var newVideos = Model.getVideos();
      if (Model.getBookmarks().length > 0 && newVideos.length>0) {
        $scope.latestVideos = [newVideos[0],newVideos[1],newVideos[2]];
        $scope.videos = newVideos;
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
