'use strict';

angular.module('app.entity-slider', []).directive('entitySlider', ['$log', 'entityProxy', 'Model', '$ionicSlideBoxDelegate', entitySliderDirective]);

function entitySliderDirective($log, entityProxy, Model, $ionicSlideBoxDelegate) {
  return {
    restrict: 'E',
    scope: {},
    replace: false,
    link: function (scope, element, attrs) {
      scope.currentEntityIndex = 0;

      scope.$watch(
        function () {
          return Model.getChapter();
        },
        function (newChapter) {
          if (newChapter != null && newChapter.fragments != null) {
            setEntityContent(newChapter.fragments);
          }
        }
      );

      scope.$watch(
        function () {
          return Model.getFragment()
        },
        function (newFragment) {
          if (newFragment != null) {
            debug('Automatically slide to entity index: ' + newFragment.index);
            scope.currentEntityIndex = newFragment.index;
            $ionicSlideBoxDelegate.update();
          }
        }
      );

      function setEntityContent(entities) {
        scope.entities = entities;
        debug('Loaded ' + scope.entities.length + ' entities.');
        $ionicSlideBoxDelegate.update();
      }

      scope.selectEntity = function(entityIndex) {
        scope.currentEntityIndex = entityIndex;
      };

      function debug(msg) {
        $log.debug('[Entity Slider (directive)] ' + msg)
      }


    },
    templateUrl: 'partials/directives/entity-slider.html'
  }
}
