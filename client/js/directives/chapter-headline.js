'use strict';

angular.module('app.chapter-headline', []).directive('chapterHeadline', ['$location', 'Model', playerControlsDirective]);

function playerControlsDirective($location, Model) {
  return {
    restrict: 'E',
    scope: {
      'video': '='
    },
    replace: false,
    link: function (scope, element, attrs) {

    },
    controller: function ($scope, $element) {
      $scope.play = function (chIndex) {
        $location.path('/play/' + $scope.video.id + '/' + chIndex);
      };
    },
    templateUrl: 'partials/directives/chapter-headline.html'
  }
}
