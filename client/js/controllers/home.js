'use strict';

angular.module('HomeCtrl', []).controller('HomeCtrl', ['$scope', '$location', 'eventsBus', 'Model', homeCtrl]);

function homeCtrl($scope, $location, eventsBus, Model) {
  if (Model.getVideos() != null) initialize(Model.getVideos());

  function initialize(videos) {
    Model.setVideos(videos);

    $scope.latestVideo = videos[0];
    $scope.remainingVideos = videos.slice(1);

    $scope.$$phase || $scope.$apply();
  }

  $scope.playFirst = function (videoId) {
    $location.path('/play/' + videoId + '/0');
  };

  eventsBus.subscribe('video', initialize);
}
