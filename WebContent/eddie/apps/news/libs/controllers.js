'use strict';

var tkkControllers = angular.module('tkkControllers', []);

tkkControllers.controller('MainCtrl', ['$scope', '$location', 'eventsBus', 'Data', mainCtrl]);
tkkControllers.controller('PlayerCtrl', ['$scope', '$routeParams', '$location' , 'eventsBus', 'Data', playerCtrl]);

function mainCtrl($scope, $location, eventsBus, Data) {
  console.log('Main ctrl loaded');

  if (Data.getVideo()) initialize(Data.getVideo());


  $scope.fragmentTitle = function (fg) {
    return "Fragment: " + fg.title + " @ " + (fg.startTime / 1000) + "s";
  };

  $scope.fragmentShot = function (fg) {
    var d = new Date(fg.startTime);
    var h = d.getHours() - 1;
    var m = d.getMinutes();
    var s = d.getSeconds();
    return $scope.video.shots + "/h/" + h + "/m/" + m + "/sec" + s + ".jpg";
  };

  $scope.playFragment = function (chIndex, fgIndex) {
    $location.path('/video/' + chIndex + '/' + fgIndex);
  };

  function initialize(video) {
    console.log(video);

    $scope.video = video;
    $scope.$$phase || $scope.$apply();
  }

  var processVideo = function (video) {
    Data.setVideo(video);
    initialize(video);
  };

  eventsBus.subscribe($scope, 'video', processVideo);
}

function playerCtrl($scope, $routeParams, $location, eventsBus, Data) {
  $scope.chapterIndex = $routeParams.chapterIndex;
  $scope.fragmentIndex = $routeParams.fragmentIndex;

  console.log('Player ctrl loaded @ ' + $scope.chapterIndex + ' - ' + $scope.fragmentIndex);

  if (Data.getVideo()) showVideo(Data.getVideo());


  $scope.goToMain = function () {
    $location.path('/');
  };

  function showVideo(video) {
    console.log(video);

    $scope.chapter = video.chapters[$scope.chapterIndex];
    $scope.fragment = $scope.chapter.fragments[$scope.fragmentIndex];
    $scope.$$phase || $scope.$apply();

    var player = $('#player')[0];
    var source = $('#source')[0];
    player.poster = video.poster;
    source.src = video.src;
    player.load();

    $(player).on('loadedmetadata', function () {
      player.currentTime = $scope.fragment.startTime / 1000; //in seconds
    });
  }

  var processVideo = function (video) {
    Data.setVideo(video);
    showVideo(video);
  };

  eventsBus.subscribe($scope, 'video', processVideo);
}
