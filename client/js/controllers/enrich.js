'use strict';

angular.module('EnrichCtrl', []).controller('EnrichCtrl',
  ['$scope', '$modalInstance', 'entityProxy', 'Data', 'chapter', enrichCtrl]);

function enrichCtrl($scope, $modalInstance, entityProxy, Data, chapter) {
  $scope.chapter = chapter;

  $scope.entities = _.chain(chapter.fragments)
    .map(function (f) {
      return {title: f.title.trim(), url: f.locator.trim()}
    })
    .filter(function (e) {
      return e.url.length > 0
    })
    .uniq(false, function (e) {
      return e.url;
    })
    .value();

  //TODO for now when the enrich screen is brought up we load the first entity
  callEntityProxy($scope.entities[0].url);

  function callEntityProxy(loc) {
    $scope.loading = true;

    entityProxy.get({loc: loc}, function (r) {
      $scope.proxyAnswer = _.property(loc)(r);
      console.log($scope.proxyAnswer);

      $scope.loading = false;
    });
  }

  $scope.proxy = function (loc) {
    callEntityProxy(loc)
  };

  $scope.ok = function () {
    $modalInstance.close();
  };

}
