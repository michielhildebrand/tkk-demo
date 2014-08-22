'use strict';

angular.module('EnrichCtrl', []).controller('EnrichCtrl',
  ['$scope', '$modalInstance', 'entityProxy', 'Model', 'chapter', enrichCtrl]);

function enrichCtrl($scope, $modalInstance, entityProxy, Model, chapter) {
  $scope.chapter = chapter;
  $scope.crumb = [];

  loadFirstInformationCard();

  $scope.relatedVideos = Model.getOtherVideos();

  function loadFirstInformationCard() {
    $scope.loading = true;
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

    updateCrumb(chapter.title, true);

    $scope.proxyAnswer = {
      label: [
        {value: chapter.title}
      ],
      thumb: [], //TODO chapter artwork picture (special object)
      entities: $scope.entities
    };

    $scope.loading = false;
  }

  function callEntityProxy(title, loc, restart) {
    updateCrumb(title, restart);
    $scope.loading = true;

    entityProxy.get({loc: loc}, function (r) {
      $scope.proxyAnswer = _.property(loc)(r);
      //console.log($scope.proxyAnswer);

      $scope.loading = false;
    });
  }

  function updateCrumb(title, restart) {
    if (restart) {
      $scope.crumb = [title]
    } else {
      $scope.crumb.push(title)
    }
  }

  $scope.proxy = function (e, restart) {
    callEntityProxy(e.value, e.uri, restart)
  };

  $scope.ok = function () {
    $modalInstance.close();
  };

}
