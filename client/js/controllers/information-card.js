'use strict';

angular.module('InformationCardCtrl', []).controller('InformationCardCtrl', ['$scope', '$modalInstance', 'eventsBus', 'Data', informationCardCtrl]);

function informationCardCtrl($scope, $modalInstance, eventsBus, Data) {

  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

}
