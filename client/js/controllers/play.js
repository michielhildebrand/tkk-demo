'use strict';

angular.module('PlayCtrl', []).controller('PlayCtrl', ['$scope', '$routeParams', '$location' , '$modal', 'Model', playCtrl]);

function playCtrl($scope, $routeParams, $location, $modal, Model) {
  $scope.second = false;
  $scope.beaming = false;

  $scope.showMenu = false;

  $scope.$watch(
    function () {
      return Model.getVideos();
    },
    function (newVideos) {
      if (newVideos.length != 0) {
        Model.play($routeParams.videoId, $routeParams.chapterIndex);
        $scope.relatedVideos = newVideos;
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
      sendToTv({action: 'play', video: Model.getVideo(), chapter: Model.getChapterIndex()});
      openEnrichment();
    } else {
      //TODO what should happen here?
    }
  };

  $scope.showEnrichment = function() {
    openEnrichment();
  };

  function sendToTv(action) {
    send({target: 'tv', data: action});
  }
  function send(msg) {
    eddie.putLou('ngproxy', JSON.stringify(msg));
  }

  function openEnrichment() {
    var modalInstance = $modal.open({
      templateUrl: 'partials/controllers/enrich.html',
      controller: 'EnrichCtrl',
      size: 'lg',
      resolve: {
        chapter: function () {
          return $scope.chapter;
        }
      }
    });

    modalInstance.result.then(function () {
      //console.log('Modal accepted at: ' + new Date());
    }, function () {
      //console.log('Modal dismissed at: ' + new Date());
    });
  }
}
