'use strict';

angular.module('app.chapter-artworks', []).directive('chapterArtworks', ['europeanaApi', 'Model', chapterArtworksDirective]);

function chapterArtworksDirective(europeanaApi, Model) {
  return {
    restrict: 'E',
    scope: {
      'chapter': '='
    },
    replace: false,
    link: function (scope, element, attrs) {

    },
    controller: function ($scope, $element) {
      $scope.loading = false;

      loadChapterInformation();

      // The chapter information are shown in the first information card
      function loadChapterInformation() {
        var metadata = _.chain($scope.chapter.fragments)
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

        var chapterTitle = $scope.chapter.title;

        var chapterEntity = {value: chapterTitle, uri: ''};
        callEuropeanaApi(chapterEntity);
      }

      function callEuropeanaApi(e) {
        $scope.loading = true;
        europeanaApi.get({query: e.value}, function (r) {
          console.log(r);

          $scope.loading = false;
        });
      }

      $scope.proxy = function (entity) {
        callEuropeanaApi(entity)
      };
    },
    templateUrl: 'partials/directives/chapter-artworks.html'
  }
}
