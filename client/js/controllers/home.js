'use strict';

angular.module('HomeCtrl', []).controller('HomeCtrl', ['$scope', '$location', 'eventsBus', 'Data', homeCtrl]);

function homeCtrl($scope, $location, eventsBus, Data) {
  if (Data.getVideo() != null) initialize(Data.getVideo());

  function initialize(video) {
    //console.log(video);

    Data.setVideo(video);
    $scope.video = video;

    $scope.$$phase || $scope.$apply();
  }

  $scope.playFirst = function () {
    $location.path('/play/0');
  };

  eventsBus.subscribe('video', initialize);
}
