'use strict';

angular.module('app.chapter-enrich', []).directive('chapterEnrich', ['Model', chapterEnrichDirective]);

function chapterEnrichDirective(Model) {
  return {
    restrict: 'E',
    scope: {
      height: '='
    },
    replace: false,
    link: function (scope, element, attrs) {
      scope.$watch('height', function (newHeight) {
        if (newHeight != 0) {
          var dimensions = angular.element('.links h3');
          var dimensionsHeight = dimensions.length * 30; //TODO fix it: grab height of one dimension label
          angular.element('.links .scroll-view').height(newHeight - dimensionsHeight);
          angular.element('.chapters .scroll-view').height(newHeight - 30);
          angular.element('.content .scroll-view').height(newHeight);
        }
      });
    },
    controller: function ($scope) {
      $scope.crumb = [];
      $scope.content = null;
      $scope.activeLinks = "about";

      $scope.$watch(
        function () {
          return Model.getChapter()
        },
        function (newChapter) {
          if (newChapter != null) {
            $scope.activeLinks = "about";
          }
        }
      );

      $scope.toggleLinks = function (active) {
        if($scope.activeLinks==active) {
          $scope.activeLinks = null
        } else {
          $scope.activeLinks = active;
        }
      };

      this.extractMetadata = function (ch) {
        return _.chain(ch.fragments)
          .map(function (f) {
            return {value: f.title.trim(), uri: f.locator.trim()}
          })
          .filter(function (m) {
            return m.value.length > 0
          })
          .uniq(false, function (m) {
            return m.value;
          })
          .sortBy(function (m) {
            return m.value.toLowerCase();
          })
          .value();
      };

      this.extractArtworks = function (ch) {
        if (ch.artworks != null) {
          return _(ch.artworks).map(function (a) {
            return {value: a}
          });
        } else {
          return this.extractMetadata(ch);
        }
      };

      this.extractBackground = function (ch) {
        if (ch.backgrounds != null) {
          return _(ch.backgrounds).map(function (a) {
            return {value: a}
          });
        } else {
          return this.extractMetadata(ch);
        }
      };

      this.setContent = function (content, crumb) {
        $scope.content = content;
        $scope.crumb = crumb ? [crumb] : [];
      };

      this.updateCrumb = function (e) {
        var index = _($scope.crumb).pluck('value').indexOf(e.value);
        if (index != -1) {
          $scope.crumb = _($scope.crumb).first(index + 1);
        } else {
          $scope.crumb.push(e)
        }
      }
    },
    templateUrl: 'partials/directives/chapter-enrich.html'
  }
}
