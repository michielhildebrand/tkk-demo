'use strict';

angular.module('EnrichCtrl', []).controller('EnrichCtrl',
  ['$scope', '$modalInstance', 'entityProxy', 'Data', 'chapter', enrichCtrl]);

function enrichCtrl($scope, $modalInstance, entityProxy, Data, chapter) {
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

  $scope.answered = false;

  $scope.proxy = function(loc) {
    $scope.answered = false;

    entityProxy.get({loc: loc}, function (r) {
      $scope.proxyAnswer = _.property(loc)(r);
      console.log($scope.proxyAnswer);

      var type = $scope.proxyAnswer.type[0];
      if (type == 'person' || type == 'artist') {
        $scope.entityType = 'artist';
      } else {
        $scope.entityType = 'unknown';
      }

      $scope.answered = true;
    });
  };

  $scope.ok = function () {
    $modalInstance.close();
  };

}
