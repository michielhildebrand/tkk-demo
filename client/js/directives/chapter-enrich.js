'use strict';

angular.module('app.chapter-enrich', []).directive('chapterEnrich', ['Model', chapterEnrichDirective]);

function chapterEnrichDirective(Model) {
  return {
    restrict: 'E',
    scope: {
      video: '='
    },
    replace: false,
    link: function (scope, element, attrs) {
      function setHeight() {
        var contentHeight = angular.element(".explore")[0].offsetHeight - 49-81; //header and footer
        scope.dimensionHeight = contentHeight - (scope.dimensions.length * 34); //TODO fix it: grab height of one dimension label
        angular.element('.content .scroll-view').height(contentHeight);
      }

      scope.$watch(
        function () {
          return Model.getChapter()
        },
        function (newChapter) {
          if (newChapter != null) {
            scope.dimensions = newChapter.dimensions;
            if(scope.dimensions.length>0) {
              if(scope.dimension==null) {
                scope.dimension = scope.dimensions[0].id;
              }
            }
            setHeight();
          }
        }
      );

      scope.toggleDimension = function (active) {
        if (scope.dimension == active) {
          scope.dimension = null;
        } else {
          scope.dimension = active;
        }
      };

      window.onresize = function() {
        setHeight();
      }
    },

    controller: function ($scope) {
      $scope.content = null;
      this.setContent = function (content) {
        $scope.content = content;
      }
    },

    templateUrl: 'partials/directives/chapter-enrich.html'
  }
}

/*,
 controller: function ($scope) {
 $scope.crumb = [];
 $scope.content = null;

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
 },*/