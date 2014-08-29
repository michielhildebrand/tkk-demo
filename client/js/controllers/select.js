'use strict';

angular.module('SelectCtrl', []).controller('SelectCtrl', ['$scope', '$location','Config', 'Eddie', 'Model', selectCtrl]);

function selectCtrl($scope, $location, Config, Eddie, Model) {
  $scope.users = Config.users;

  $scope.join = function(user) {
    Model.setUser(user);
    Eddie.init(user);

    $location.path('/episodes/' + user);
  }
}
