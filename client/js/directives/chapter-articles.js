'use strict';

angular.module('app.chapter-articles', []).directive('chapterArticles', ['Model', chapterArticlesDirective]);

function chapterArticlesDirective(Model) {
  return {
    restrict: 'E',
    scope: {
      'chapter': '='
    },
    replace: false,
    link: function (scope, element, attrs) {

    },
    controller: function ($scope, $element) {

    },
    templateUrl: 'partials/directives/chapter-articles.html'
  }
}
