'use strict';

angular.module('PlayCtrl', []).controller('PlayCtrl', ['$scope', '$routeParams', '$location', 'Model', playCtrl]);

function playCtrl($scope, $routeParams, $location, Model) {
  $scope.second = false;
  $scope.beaming = false;

  $scope.showMenu = false;
  $scope.showEnrichment = false;

  $scope.$watch(
    function () {
      return Model.getVideos();
    },
    function (newVideos) {
      if (newVideos.length > 0) {
        Model.play($routeParams.videoId, $routeParams.chapterIndex);
        $scope.video = Model.getVideo();
        $scope.chapter = Model.getChapter();
      }
    }
  );

  $scope.goToMain = function () {
    $location.path('/');
  };

  $scope.togglePlayerMenu = function () {
    $scope.showMenu = !$scope.showMenu;
  };

  $scope.toggleBeam = function () {
    $scope.beaming = !$scope.beaming;
    if ($scope.beaming) {
      sendToTv({action: 'play', video: Model.getVideo().id, chapter: Model.getChapterIndex()});
      openEnrichment();
    } else {
      //TODO what should happen here?
    }
  };

  $scope.enrich = function() {
    openEnrichment();
  };

  function openEnrichment() {
    $scope.showEnrichment = !$scope.showEnrichment;
  }

  function sendToTv(action) {
    send({target: 'tv', data: action});
  }
  function send(msg) {
    eddie.putLou('ngproxy', JSON.stringify(msg));
  }

}
