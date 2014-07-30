'use strict';

angular.module('PlayCtrl', []).controller('PlayCtrl', ['$scope', '$routeParams', '$location' , 'eventsBus', 'Data', playCtrl]);

function playCtrl($scope, $routeParams, $location, eventsBus, Data) {
  $scope.second = false;
  $scope.video = null;

  $scope.chapterIndex = $routeParams.chapterIndex;
  $scope.fragmentIndex = $routeParams.fragmentIndex;

  console.log('Play ctrl loaded @ ' + $scope.chapterIndex + ' - ' + $scope.fragmentIndex);

  if (Data.getVideo()) showVideo(Data.getVideo());


  $scope.goToMain = function () {
    $location.path('/');
  };

  $scope.beamIt = function () {
    var v = Data.getVideo();
    var tvMsg = JSON.stringify({
      target: 'tv',
      data: {
        action: 'play',
        src: v.src,
        poster: v.poster,
        currentTime: fragmentTime()
      }
    });
    eddie.putLou('ngproxy', tvMsg);
  };

  function showVideo(video) {
    //console.log(video);

    $scope.chapter = video.chapters[$scope.chapterIndex];
    $scope.fragment = $scope.chapter.fragments[$scope.fragmentIndex];

    $scope.video = {
      poster: video.poster,
      src: video.src,
      currentTime: fragmentTime()
    };

    $scope.$$phase || $scope.$apply();
  }

  function fragmentTime() {
    return $scope.fragment.startTime / 1000; //in seconds
  }

  var processMsg = function (video) {
    Data.setVideo(video);
    showVideo(video);
  };

  eventsBus.subscribe($scope, 'video', processMsg);
}
