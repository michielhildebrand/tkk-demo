'use strict';

angular.module('HomeCtrl', []).controller('HomeCtrl', ['$scope', '$location', 'eventsBus', 'Model', homeCtrl]);

function homeCtrl($scope, $location, eventsBus, Model) {
  if (Model.getVideos().length != 0) initialize();

  function initialize() {
    var videos = Model.getVideos();
    console.log(videos);
    $scope.latestVideo = videos[0];
    $scope.remainingVideos = videos.slice(1);
  }

  $scope.playFirstChapter = function (videoId) {
    $location.path('/play/' + videoId + '/0');
  };

  function setVideos(videos) {
    Model.setVideos(videos);

    initialize();

    $scope.$$phase || $scope.$apply();
  }

  eventsBus.subscribe('video', setVideos);
}
