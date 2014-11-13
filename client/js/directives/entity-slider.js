'use strict';

angular.module('app.entity-slider', []).directive('entitySlider', ['$log', 'entityProxy', 'Model', entitySliderDirective]);

function entitySliderDirective($log, entityProxy, Model) {
  return {
    restrict: 'E',
    scope: {},
    replace: false,
    link: function (scope, element, attrs) {

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
            entityProxy.getList({urls: angular.toJson(newFragment)}, function (res) {
              debug('Set information card content: ' + JSON.stringify(res[newFragment]));
              scope.currentEntity = res;
            });
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
          debug('Loading ' + _(res).keys().length + ' entities.');
          scope.entities = res;
        });
      }

      function debug(msg) {
        $log.debug('[Entity Slider (directive)] ' + msg)
      }
    },
    templateUrl: 'partials/directives/entity-slider.html'
  }
}
