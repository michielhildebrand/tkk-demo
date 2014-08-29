'use strict';

angular.module('PlayCtrl', []).controller('PlayCtrl', ['$scope', '$routeParams', '$location', 'Model', playCtrl]);

function playCtrl($scope, $routeParams, $location, Model) {
  $scope.second = false;
  $scope.beaming = false;

  $scope.showMenu = false;
  $scope.showEnrichment = false;

  $scope.enrichFull = false;

  $scope.$watch(
    function () {
      return Model.getVideos();
    },
    function (newVideos) {
      if (newVideos.length > 0) {
        Model.play($routeParams.videoId, $routeParams.chapterIndex);
        $scope.video = Model.getVideo();
        $scope.chapter = Model.getChapter();
        $scope.metadata = extractMetadata();
      }
    }
  );

  function extractMetadata() {
    return _.chain($scope.chapter.fragments)
      .map(function (f) {
        return {value: f.title.trim(), uri: f.locator.trim()}
      })
      .filter(function (e) {
        return e.value.length > 0
      })
      .uniq(false, function (e) {
        return e.value;
      })
      .value();
  }

  $scope.goToMain = function () {
    $location.path('/episodes/' + Model.getUser());
  };

  $scope.togglePlayerMenu = function () {
    $scope.showMenu = !$scope.showMenu;
  };

  $scope.toggleEnrichFull = function () {
    $scope.enrichFull = !$scope.enrichFull;
  };

}
