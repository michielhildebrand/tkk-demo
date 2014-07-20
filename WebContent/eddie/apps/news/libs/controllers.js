'use strict';

var tkkControllers = angular.module('tkkControllers', []);

tkkControllers.controller('MediaResourceCtrl', ['$scope', 'mediaResource', mediaResourceCtrl]);
tkkControllers.controller('VideoCtrl', ['$scope', 'eventsBus', videoCtrl]);
tkkControllers.controller('MainCtrl', ['$scope', 'eventsBus', mainCtrl]);

function mainCtrl($scope, eventsBus) {

  $scope.titleFragment = function (fg) {
    return "Fragment: " + fg.title +" @ " + fg.startTime + "s";
  };

  $scope.shotFromFragment = function (fg) {
    var d = new Date(fg.startTime);
    var h = d.getHours() - 1;
    var m = d.getMinutes();
    var s = d.getSeconds();
    return $scope.video.shots + "/h/" + h + "/m/" + m + "/sec" + s + ".jpg";
  };

  var initialize = function (video) {
    console.log(video);
    $scope.video = video;
    $scope.$apply();
  };

  eventsBus.subscribe($scope, 'video', initialize);
}

function videoCtrl($scope, eventsBus) {
  $scope.videoAvailable = false;

  var showVideo = function (video) {
    console.log(video);

    $scope.streamUrl = video.src;
    $scope.posterUrl = video.poster;
    $scope.title = video.title;

    $scope.videoAvailable = true;

    $scope.$apply();
  };

  eventsBus.subscribe($scope, 'video', showVideo);
}

function mediaResourceCtrl($scope, mediaResource) {
  $scope.items = [];
  $scope.currentResourcePage = 0;
  $scope.currentFragmentPage = 0;
  $scope.fragmentsVisible = false;

  fetchMediaResources(0);

  $scope.nextPage = function () {
    $scope.currentResourcePage++;
    fetchMediaResources($scope.currentResourcePage)
  };

  $scope.previousPage = function () {
    $scope.currentResourcePage--;
    fetchMediaResources($scope.currentResourcePage)
  };

  $scope.fetchFragments = function (aboutUrl) {
    var n = aboutUrl.lastIndexOf('/');
    var id = aboutUrl.substring(n + 1);
    $scope.currentFragmentPage = 0;
    fetchMediaFragments(id, $scope.currentFragmentPage);
  };

  function fetchMediaResources(page) {
    console.log('fetching mediaresources (page ' + page + ')');
    mediaResource.get({_page: page}, function (r) {
      $scope.items = r.result.items;
      console.log($scope.items.length);
    });
  }

  function fetchMediaFragments(id, page) {
    console.log('fetching mediafragments for ' + id + ' (page ' + page + ')');
    mediaResource.mediafragments({id: id, _page: page}, function (r) {
      $scope.fragments = r.result.items;
      console.log($scope.fragments.length);
      $scope.fragmentsVisible = true;
    });
  }
}

