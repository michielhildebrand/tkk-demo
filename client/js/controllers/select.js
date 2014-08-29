'use strict';

angular.module('SelectCtrl', []).controller('SelectCtrl', ['$scope', '$location','Config', selectCtrl]);

function selectCtrl($scope, $location, Config) {
  $scope.users = Config.users;

  $scope.goToEpisodes = function(user) {
    $location.path('/episodes/' + user);
  };

  $scope.goToTV = function(user) {
    $location.path('/tv/' + user);
  }
}
