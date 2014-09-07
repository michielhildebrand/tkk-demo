'use strict';

angular.module('app.chapter-enrich', []).directive('chapterEnrich', ['Model', chapterEnrichDirective]);

function chapterEnrichDirective(Model) {
  return {
    restrict: 'E',
    scope: {
      height : '='
    },
    replace: false,
    link: function (scope, element, attrs) {
      scope.$watch('height', function(newHeight) {
        if (newHeight != 0) {
          var dimensions = angular.element('.links h3');
          var dimensionsHeight = dimensions.length * 30; //TODO fix it: grab height of one dimension label
          angular.element('.links .scroll-view').height(newHeight - (dimensionsHeight));
        }
      });
    },
    controller: function ($scope) {
      $scope.crumb = [];
      $scope.content = {};
      $scope.activeLinks = "about";

      $scope.showLinks = function (active) {
        $scope.activeLinks = active;
      };

      this.extractMetadata = function(ch) {
        return _.chain(ch.fragments)
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
      };

      this.setContent = function(c, e) {
        $scope.content = c;
      };

      this.setCrumb = function(e) {
        $scope.crumb = [e];
      };

      this.updateCrumb = function(e) {
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
