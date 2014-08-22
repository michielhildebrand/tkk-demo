'use strict';

angular.module('EnrichCtrl', []).controller('EnrichCtrl',
  ['$scope', '$modalInstance', 'entityProxy', 'Model', 'chapter', enrichCtrl]);

function enrichCtrl($scope, $modalInstance, entityProxy, Model, chapter) {
  $scope.chapter = chapter;

  $scope.loading = false;

  $scope.crumb = [];
  var answers = {};

  loadChapterInformationCard();

  $scope.relatedVideos = Model.getOtherVideos();

  // The chapter information are shown in the first information card
  function loadChapterInformationCard() {
    var metadata = _.chain(chapter.fragments)
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

    //metadata.push({value: 'Piet Mondrian', uri: 'http://dbpedia.org/resource/Piet_Mondrian'}); //for testing navigation uncomment this

    answers[chapter.title] = {
      label: [
        {value: chapter.title}
      ],
      thumb: [''], //TODO chapter artwork picture (special object)
      metadata: metadata
    };

    var chapterEntity = {value: chapter.title, uri: ''};
    callEntityProxy(chapterEntity, true);
  }

  function callEntityProxy(e, restart) {
    updateCrumb(e, restart);

    $scope.loading = true;
    if (!_(answers).has(e.value)) {
      entityProxy.get({loc: e.uri}, function (r) {
        $scope.proxyAnswer = _.property(e.uri)(r);
        answers[e.value] = $scope.proxyAnswer;

        $scope.loading = false;
      });
    } else {
      $scope.proxyAnswer = _.property(e.value)(answers);
      $scope.loading = false;
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
