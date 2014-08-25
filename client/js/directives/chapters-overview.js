'use strict';

angular.module('app.chapters-overview', []).directive('chaptersOverview', ['Model', chaptersOverviewDirective]);

function chaptersOverviewDirective(Model) {
  return {
    restrict: 'E',
    scope: {
      'video': '='
    },
    replace: false,
    link: function (scope, element, attrs) {

    },
    controller: function ($scope, $element) {
      $scope.isSelected = function(chIndex) {
        return Model.getChapterIndex() == chIndex;
      };
    },
    templateUrl: 'partials/directives/chapters-overview.html'
  }
}
