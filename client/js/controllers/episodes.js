'use strict';

angular.module('EpisodesCtrl', []).controller('EpisodesCtrl', ['$scope', '$location', 'Model', episodesCtrl]);

function episodesCtrl($scope, $location, Model) {

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
    $location.path('/play/' + Model.getUser() + '/' + videoId + '/0');
  };

}
