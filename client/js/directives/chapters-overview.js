'use strict';

angular.module('app.chapters-overview', []).directive('chaptersOverview', [chaptersOverviewDirective]);

function chaptersOverviewDirective() {
  return {
    restrict: 'E',
    scope: {
      'video': '='
    },
    replace: false,
    link: function (scope, element, attrs) {

    },
    templateUrl: 'partials/directives/chapters-overview.html'
  }
}
