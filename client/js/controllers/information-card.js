'use strict';

angular.module('InformationCardCtrl', []).controller('InformationCardCtrl',
  ['$scope', '$modalInstance', 'entityProxy', 'Data', 'chapter', informationCardCtrl]);

function informationCardCtrl($scope, $modalInstance, entityProxy, Data, chapter) {
  $scope.chapter = chapter;
  $scope.locators = _.chain(chapter.fragments)
    .pluck('locator')
    .filter(function (l) {
      return l != ""
    })
    .value();

  $scope.selectedLoc = "";
  $scope.proxyAnswer = {};

  $scope.proxy = function(loc) {
    $scope.selectedLoc = loc;
    $scope.proxyAnswer = {};

    entityProxy.get({loc: loc}, function (r) {
      $scope.proxyAnswer = _.property(loc)(r);
    });
  };

  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

}
