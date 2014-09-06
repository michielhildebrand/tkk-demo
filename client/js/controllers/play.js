'use strict';

angular.module('PlayCtrl', []).controller('PlayCtrl', ['$scope', '$state', '$location', 'Model', playCtrl]);

function playCtrl($scope, $state, $location, Model) {
  $scope.second = false;
  $scope.beaming = false;

  $scope.showMenu = false;
  $scope.enrich = false;

  $scope.$watch(
    function () {
      return Model.getVideos();
    },
    function (newVideos) {
      if (newVideos.length > 0) {
        Model.play($state.params.videoId, $state.params.idx);
        $scope.video = Model.getVideo();
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

  $scope.togglePlayerMenu = function () {
    $scope.showMenu = !$scope.showMenu;
  };

  $scope.toggleEnrich = function () {
    $scope.enrich = !$scope.enrich;
  };

}
