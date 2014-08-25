'use strict';

angular.module('app.chapter-related', []).directive('chapterRelated', ['Model', chapterRelatedDirective]);

function chapterRelatedDirective(Model) {
  return {
    restrict: 'E',
    scope: {
      'chapter': '='
    },
    replace: false,
    link: function (scope, element, attrs) {

    },
    controller: function ($scope, $element) {
      $scope.relatedVideos = Model.getVideos();
    },
    templateUrl: 'partials/directives/chapter-related.html'
  }
}
