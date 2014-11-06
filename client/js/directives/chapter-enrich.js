'use strict';

angular.module('app.chapter-enrich', []).directive('chapterEnrich', ['Config', 'Model', chapterEnrichDirective]);

function chapterEnrichDirective(Config, Model) {
  return {
    restrict: 'E',
    scope: {
      height: '=',
      video: '='
    },
    replace: false,
    link: function (scope, element, attrs) {
      scope.$watch('height', function (newHeight) {
        if (newHeight != 0) {
          var dimensions = angular.element('.links h3');
          var dimensionsHeight = dimensions.length * 34; //TODO fix it: grab height of one dimension label
          angular.element('.links .scroll-view').height(newHeight - dimensionsHeight);
          angular.element('.chapters .scroll-view').height(newHeight - 34);
          angular.element('.content .scroll-view').height(newHeight);
        }
      });

      scope.dimensions = Config.dimensions;
      scope.dimension = scope.dimensions[0].id;

      scope.$watch(
        function () {
          return Model.getChapter()
        },
        function (newChapter) {
          if (newChapter != null) {
            scope.dimension = scope.dimensions[0].id;
          }
        }
      );

      scope.toggleDimension = function (active) {
        if (scope.dimension == active) {
          scope.dimension = null
        } else {
          scope.dimension = active;
        }
      };
    },
    controller: function ($scope) {
      $scope.crumb = [];
      $scope.content = null;

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

      this.setContent = function (content, crumb, linked) {
        $scope.content = content;

        if (!linked) {
          $scope.crumb = crumb ? [crumb] : [];
        } else {
          updateCrumb(crumb);
        }
      };

      var updateCrumb = function (e) {
        var index = _($scope.crumb).pluck('value').indexOf(e.value);
        if (index != -1) {
          $scope.crumb = _($scope.crumb).first(index + 1);
        } else {
          $scope.crumb.push(e)
        }
      };

      $scope.setAbout = function (entity) {
        $scope.linkedAbout = entity;
      };
    },
    templateUrl: 'partials/directives/chapter-enrich.html'
  }
}
