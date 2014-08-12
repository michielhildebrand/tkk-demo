'use strict';

angular.module('InformationCardCtrl', []).controller('InformationCardCtrl',
  ['$scope', '$modalInstance', 'entityProxy', 'Data', 'chapter', informationCardCtrl]);

function informationCardCtrl($scope, $modalInstance, entityProxy, Data, chapter) {
  $scope.chapter = chapter;
  $scope.locators = _.chain(chapter.fragments)
    .pluck('locator')
    .map(function(l) {
      return l.trim();
    })
    .filter(function (l) {
      return l.length > 0;
    })
    .uniq()
    .value();

  $scope.selectedLoc = "";
  $scope.proxyAnswer = {};

  $scope.proxy = function(loc) {
    $scope.selectedLoc = loc;
    $scope.proxyAnswer = {};

    entityProxy.get({loc: loc}, function (r) {
      $scope.proxyAnswer = _.property(loc)(r);

      console.log($scope.proxyAnswer);
    });
  };

  $scope.ok = function () {
    $modalInstance.close();
  };

}
