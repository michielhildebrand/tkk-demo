'use strict';

angular.module('TvCtrl', []).controller('TvCtrl', ['$scope', '$routeParams', '$location' , 'eventsBus', 'Data', tvCtrl]);

function tvCtrl($scope, $routeParams, $location, eventsBus, Data) {
  $scope.chapterIndex = $routeParams.chapterIndex;
  $scope.fragmentIndex = $routeParams.fragmentIndex;

  console.log('Player ctrl loaded @ ' + $scope.chapterIndex + ' - ' + $scope.fragmentIndex);

  if (Data.getVideo()) showVideo(Data.getVideo());


  $scope.goToMain = function () {
    $location.path('/');
  };

  $scope.beamIt = function () {
    var v = Data.getVideo();
    var msg = JSON.stringify({
      target: 'tv',
      data: {
        action: 'play',
        src: v.src,
        poster: v.poster,
        currentTime: fragmentTime()
      }
    });
    eddie.putLou('ngproxy', msg);
  };

  function showVideo(video) {
    //console.log(video);

    $scope.chapter = video.chapters[$scope.chapterIndex];
    $scope.fragment = $scope.chapter.fragments[$scope.fragmentIndex];
    $scope.$$phase || $scope.$apply();

    var player = $('#player')[0];
    var source = $('#source')[0];
    player.poster = video.poster;
    source.src = video.src;
    player.load();

    $(player).on('loadedmetadata', function () {
      player.currentTime = fragmentTime();
    });
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
