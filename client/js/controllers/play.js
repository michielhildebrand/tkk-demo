'use strict';

angular.module('PlayCtrl', []).controller('PlayCtrl', ['$scope', '$routeParams', '$location' , 'eventsBus', 'Data', playCtrl]);

function playCtrl($scope, $routeParams, $location, eventsBus, Data) {
  $scope.second = false;

  $scope.chapterIndex = $routeParams.chapterIndex;

  console.log('Play ctrl loaded @ ' + $scope.chapterIndex);

  if (Data.getVideo() != null) showVideo(Data.getVideo());


  $scope.goToMain = function () {
    $location.path('/');
  };

  function showVideo(video) {
    //console.log(video);

    Data.play(video, $scope.chapterIndex);
    $scope.video = video;
    $scope.chapter = video.chapters[$scope.chapterIndex];

    $scope.$$phase || $scope.$apply();
  }

  eventsBus.subscribe('video', showVideo);
}
