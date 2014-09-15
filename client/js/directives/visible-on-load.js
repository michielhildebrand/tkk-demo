'use strict';

angular.module('app.visible-on-load', []).directive('visibleOnLoad', [visibleOnLoadDirective]);

function visibleOnLoadDirective() {
  return {
    restrict: 'A',
    scope: {
      ngSrc: '@'
    },
    replace: false,
    link: function(scope, element) {
      element.on('load', function() {
        element.removeClass('hide');
      });
      scope.$watch('ngSrc', function(newSrc) {
        if (newSrc != null) {
          element.addClass('hide');
        }
      });
    }
  }
}
