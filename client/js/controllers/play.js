'use strict';

angular.module('PlayCtrl', []).controller('PlayCtrl', ['$scope', '$state', '$location', 'Model', playCtrl]);

function playCtrl($scope, $state, $location, Model) {
  $scope.second = false;
  $scope.beaming = false;
  $scope.enrich = false;

  $scope.playContentHeight = 0;

  $scope.$watch(
    function () {
      return Model.getVideos();
    },
    function (newVideos) {
      if (newVideos.length > 0) {
        Model.play($state.params.videoId, $state.params.idx);
        $scope.video = Model.getVideo();
        console.log(angular.element('#play-content'), angular.element('#play-content')[0].offsetHeight)
        $scope.playContentHeight = angular.element('#play-content')[0].offsetHeight;
      }
    }
  );

  $scope.$watch(
    function () {
      return Model.getChapterIndex();
    },
    function (newIndex) {
      if (newIndex != null) {
        $location.search('idx', newIndex);
      }
    }
  );

  $scope.goToMain = function () {
    $state.go('episodes', {user: Model.getUser()});
  };

}
