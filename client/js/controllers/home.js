'use strict';

angular.module('HomeCtrl', []).controller('HomeCtrl', ['$scope', 'eventsBus', 'Data', homeCtrl]);

function homeCtrl($scope, eventsBus, Data) {
  if (Data.getVideo() != null) initialize(Data.getVideo());

  function initialize(video) {
    //console.log(video);

    Data.setVideo(video);
    $scope.video = video;

    $scope.$$phase || $scope.$apply();
  }

  eventsBus.subscribe($scope, 'video', initialize);
}
