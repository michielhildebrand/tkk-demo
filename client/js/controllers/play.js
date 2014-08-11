'use strict';

angular.module('PlayCtrl', []).controller('PlayCtrl', ['$scope', '$routeParams', '$location' , '$modal', 'eventsBus', 'Data', playCtrl]);

function playCtrl($scope, $routeParams, $location, $modal, eventsBus, Data) {
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

  $scope.beamIt = function () {
    sendToTv({action: 'play', video: Data.getVideo(), chapter: Data.getChapter()});
    openCard();
  };

  function sendToTv(action) {
    send({target: 'tv', data: action});
  }
  function send(msg) {
    eddie.putLou('ngproxy', JSON.stringify(msg));
  }

  function openCard() {
    var modalInstance = $modal.open({
      templateUrl: 'partials/information-card.html',
      controller: 'InformationCardCtrl',
      size: 'lg'
    });

    modalInstance.result.then(function () {
      console.log('Modal accepted at: ' + new Date());
    }, function () {
      console.log('Modal dismissed at: ' + new Date());
    });
  }
}
