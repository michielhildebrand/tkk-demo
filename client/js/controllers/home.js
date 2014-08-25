'use strict';

angular.module('HomeCtrl', []).controller('HomeCtrl', ['$scope', '$location', 'Model', homeCtrl]);

function homeCtrl($scope, $location, Model) {

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
    $location.path('/play/' + videoId + '/0');
  };

}
