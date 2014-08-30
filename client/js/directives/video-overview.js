'use strict';

angular.module('app.video-overview', []).directive('videoOverview', [videoOverviewDirective]);

function videoOverviewDirective() {
  return {
    restrict: 'E',
    scope: {
      'video': '='
    },
    replace: false,
    link: function (scope, element, attrs) {

    },
    templateUrl: 'partials/directives/video-overview.html'
  }
}
