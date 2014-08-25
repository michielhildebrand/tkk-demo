'use strict';

angular.module('app.chapter-artworks', []).directive('chapterArtworks', ['europeanaApi', 'Model', chapterArtworksDirective]);

function chapterArtworksDirective(europeanaApi, Model) {
  return {
    restrict: 'E',
    scope: {
      'chapter': '=',
      'metadata': '='
    },
    replace: false,
    link: function (scope, element, attrs) {

    },
    controller: function ($scope, $element) {
      $scope.artworks = [];
      $scope.loading = false;

      loadChapterArtworks();

      function loadChapterArtworks() {
        var metadataSize = $scope.metadata.length;

        $scope.loading = true;
        _($scope.metadata).each(function (m, index) {
          europeanaApi.get({query: m.value}, function (r) {
            if (r.itemsCount > 0) {
              _(r.items).each(function (i) {
                if (i.edmPreview && i.title) {
                  $scope.artworks.push({img: i.edmPreview[0], title: i.title[0]});
                }
              });
            }

            if (index == metadataSize - 1) {
              $scope.loading = false;
            }
          });
        });
      }
    },
    templateUrl: 'partials/directives/chapter-artworks.html'
  }
}
