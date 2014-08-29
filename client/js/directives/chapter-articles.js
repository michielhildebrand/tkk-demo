'use strict';

angular.module('app.chapter-articles', []).directive('chapterArticles', [chapterArticlesDirective]);

function chapterArticlesDirective() {
  return {
    restrict: 'E',
    scope: {
      'chapter': '='
    },
    replace: false,
    link: function (scope, element, attrs) {

    },
    templateUrl: 'partials/directives/chapter-articles.html'
  }
}
