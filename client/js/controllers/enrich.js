'use strict';

angular.module('EnrichCtrl', []).controller('EnrichCtrl',
  ['$scope', '$modalInstance', 'entityProxy', 'Model', 'chapter', enrichCtrl]);

function enrichCtrl($scope, $modalInstance, entityProxy, Model, chapter) {
  $scope.chapter = chapter;

  $scope.loading = true;

  $scope.crumb = [];
  var answers = {};

  loadChapterInformationCard();

  $scope.relatedVideos = Model.getOtherVideos();

  // the chapter information are shown in the first information card
  function loadChapterInformationCard() {
    $scope.metas = _.chain(chapter.fragments)
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

    //$scope.metas.push({value: 'Piet Mondrian', uri: 'http://dbpedia.org/resource/Piet_Mondrian'}); //for testing navigation uncomment this

    updateCrumb({value: chapter.title, uri: ''}, true);

    $scope.proxyAnswer = {
      label: [
        {value: chapter.title}
      ],
      thumb: [], //TODO chapter artwork picture (special object)
      metas: $scope.metas
    };

    answers[chapter.title] = $scope.proxyAnswer;

    $scope.loading = false;
  }

  function callEntityProxy(e, restart) {
    updateCrumb(e, restart);

    if (!_(answers).has(e.value)) {
      $scope.loading = true;
      entityProxy.get({loc: e.uri}, function (r) {
        $scope.proxyAnswer = _.property(e.uri)(r);
        answers[e.value] = $scope.proxyAnswer;

        $scope.loading = false;
      });
    } else {
      $scope.proxyAnswer = _.property(e.value)(answers);
    }
  }

  function updateCrumb(e, restart) {
    if (restart) {
      $scope.crumb = [e]
    } else {
      $scope.crumb.push(e)
    }
  }

  $scope.proxy = function (entity, restart) {
    callEntityProxy(entity, restart)
  };

}
