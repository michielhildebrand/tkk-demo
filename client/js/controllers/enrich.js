'use strict';

angular.module('EnrichCtrl', []).controller('EnrichCtrl',
  ['$scope', '$modalInstance', 'entityProxy', 'Model', 'chapter', enrichCtrl]);

function enrichCtrl($scope, $modalInstance, entityProxy, Model, chapter) {
  $scope.chapter = chapter;
  $scope.crumbs = [];
  $scope.entities = _.chain(chapter.fragments)
    .map(function (f) {
      return {value: f.title.trim(), uri: f.locator.trim()}
    })
    .filter(function (e) {
      return e.value.length > 0
    })
    .uniq(false, function (e) {
      return e.value;
    })
    .value();

  $scope.relatedVideos = Model.getOtherVideos();

  //TODO for now when the enrich screen is brought up we load the first entity
  callEntityProxy($scope.entities[0].value, $scope.entities[0].uri, true);

  function callEntityProxy(title, loc, restart) {
    if (restart) {
      $scope.crumbs = [title]
    } else {
      $scope.crumbs.push(title)
    }

    $scope.loading = true;

    entityProxy.get({loc: loc}, function (r) {
      $scope.proxyAnswer = _.property(loc)(r);

      $scope.loading = false;
    });
  }

  $scope.proxy = function (e, restart) {
    callEntityProxy(e.value, e.uri, restart)
  };

  $scope.ok = function () {
    $modalInstance.close();
  };

}
