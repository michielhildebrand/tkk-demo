'use strict';

angular.module('SelectCtrl', []).controller('SelectCtrl', ['$scope', '$location','Config', selectCtrl]);

function selectCtrl($scope, $location, Config) {
  $scope.users = Config.users;

  $scope.join = function(user) {
    $location.path('/episodes/' + user);
  }
}
