'use strict';

angular.module('HomeCtrl', []).controller('HomeCtrl', ['$scope', '$location', 'eventsBus', 'Model', homeCtrl]);

function homeCtrl($scope, $location, eventsBus, Model) {
  if (Model.getVideo() != null) initialize(Model.getVideo());

  function initialize(video) {
    //console.log(video);

    Model.setVideo(video);
    $scope.video = video;

    $scope.$$phase || $scope.$apply();
  }

  $scope.playFirst = function () {
    $location.path('/play/0');
  };

  eventsBus.subscribe('video', initialize);
}
