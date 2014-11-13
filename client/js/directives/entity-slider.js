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
          return Model.getChapter()
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
          }
        }
      );

      function setEntityContent(entities) {
        var urls = _.chain(entities)
          .filter(function (e) {
            return e.locator;
          })
          .sortBy(function (e) {
            return e.startTime;
          })
          .map(function (e) {
            return e.locator;
          })
          .value();

        entityProxy.getList({urls: angular.toJson(urls)}, function (res) {
          scope.entities = [];
          _(urls).each(function(url) {
            scope.entities.push(res[url]);
          });
          debug('Loaded ' + scope.entities.length + ' entities.');
          $ionicSlideBoxDelegate.update();
        });
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
