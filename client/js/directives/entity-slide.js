'use strict';

var entitySlide = angular.module('app.entity-slide', []);

entitySlide.directive('entitySlide', ['$sce', '$log', entitySlideDirective]);

function entitySlideDirective($sce, $log) {
  return {
    restrict: 'E',
    scope: {
      'entity': '='
    },
    replace: false,
    link: function (scope, element, attrs) {

      function debug(msg) {
        $log.debug('[Information Card (directive)] ' + msg)
      }
    },
    templateUrl: 'partials/directives/entity-slide.html'
  }
}
