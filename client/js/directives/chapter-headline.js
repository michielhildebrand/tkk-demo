'use strict';

angular.module('app.chapter-headline', []).directive('chapterHeadline', ['$location', 'Model', chapterHeadlineDirective]);

function chapterHeadlineDirective($location, Model) {
  return {
    restrict: 'E',
    replace: false,
    scope: true,
    link: function (scope, element, attrs) {

    },
    controller: function ($scope, $element) {
      $scope.isSelected = function(chIndex) {
        return Model.getChapterIndex() == chIndex;
      };

      $scope.play = function (chIndex) {
        $location.path('/play/' + $scope.video.id + '/' + chIndex);
      };
    },
    templateUrl: 'partials/directives/chapter-headline.html'
  }
}
