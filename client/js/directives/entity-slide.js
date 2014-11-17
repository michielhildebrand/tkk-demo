'use strict';

angular.module('app.entity-slide', []).directive('entitySlide', ['$sce', '$log', entitySlideDirective]);

function entitySlideDirective($sce, $log) {
  return {
    restrict: 'E',
    scope: {
      'entity': '='
    },
    replace: false,
    link: function (scope, element, attrs) {

      scope.title = (scope.entity.label && scope.entity.label.length>0) ? scope.entity.label[0].value : scope.entity.title;
      if(scope.entity.thumb && scope.entity.thumb.length>0) {
        scope.image = scope.entity.thumb[0];
      }
      if(scope.entity.type && scope.entity.type.length>0) {
        scope.types = scope.entity.type;
      }
      if(scope.entity.comment && scope.entity.comment.length>0) {
        scope.description = scope.entity.comment[0].value;
      }
      scope.attributes = scope.entity.attributes;

      function debug(msg) {
        $log.debug('[Information Card (directive)] ' + msg)
      }
    },
    templateUrl: 'partials/directives/entity-slide.html'
  }
}
