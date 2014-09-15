'use strict';

angular.module('SelectCtrl', []).controller('SelectCtrl', ['$scope', '$state', 'Config', selectCtrl]);

function selectCtrl($scope, $state, Config) {
  $scope.users = Config.users;

  $scope.goToEpisodes = function (user) {
    $state.go('episodes', {user: user});
  };

  $scope.goToTV = function (user) {
    $state.go('tv', {user: user});
  }
}
