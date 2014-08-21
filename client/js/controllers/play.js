'use strict';

angular.module('PlayCtrl', []).controller('PlayCtrl', ['$scope', '$routeParams', '$location' , '$modal', 'eventsBus', 'Model', playCtrl]);

function playCtrl($scope, $routeParams, $location, $modal, eventsBus, Model) {
  $scope.second = false;
  $scope.beaming = false;

  if (Model.getVideos().length != 0) initialize();

  $scope.goToMain = function () {
    $location.path('/');
  };

  function initialize() {
    Model.play($routeParams.videoId, $routeParams.chapterIndex);

    $scope.video = Model.getVideo();
    $scope.chapter = Model.getChapter();
  }

  function setVideos(videos) {
    Model.setVideos(videos);

    initialize();

    $scope.$$phase || $scope.$apply();
  }

  eventsBus.subscribe('video', setVideos);

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
