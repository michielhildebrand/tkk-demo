'use strict';

var tkkControllers = angular.module('tkkControllers', []);

tkkControllers.controller('MediaResourceCtrl', ['$scope', 'mediaResource', 'eventsBus',
  function ($scope, mediaResource, eventsBus) {
    $scope.items = [];
    $scope.currentResourcePage = 0;
    $scope.currentFragmentPage = 0;
    $scope.fragmentsVisible = false;

    fetchMediaResources(0);

    eventsBus.subscribe($scope, 'screen', processMsg);

    function processMsg(msg) {
      console.log('----> ' + msg)
    }

    $scope.nextPage = function() {
      $scope.currentResourcePage++;
      fetchMediaResources($scope.currentResourcePage)
    };

    $scope.previousPage = function() {
      $scope.currentResourcePage--;
      fetchMediaResources($scope.currentResourcePage)
    };

    $scope.fetchFragments = function(aboutUrl) {
      var n = aboutUrl.lastIndexOf('/');
      var id = aboutUrl.substring(n + 1);
      $scope.currentFragmentPage = 0;
      fetchMediaFragments(id, $scope.currentFragmentPage);
    };

    function fetchMediaResources(page) {
      console.log('fetching mediaresources (page '+page+')');
      mediaResource.get({_page: page}, function (r) {
        $scope.items = r.result.items;
        console.log($scope.items.length);
      });
    }

    function fetchMediaFragments(id, page) {
      console.log('fetching mediafragments for ' + id + ' (page '+page+')');
      mediaResource.mediafragments({id: id, _page: page}, function (r) {
        $scope.fragments = r.result.items;
        console.log($scope.fragments.length);
        $scope.fragmentsVisible = true;
      });
    }
  }]
);