'use strict';

angular.module('app.dimension-list', []).directive('dimensionList', ['$log', 'Model', dimensionListDirective]);

function dimensionListDirective($log, Model) {
  return {
    restrict: 'E',
    scope: {
      items: '=',
      type: '=',
      height: '=',
      active: '='
    },
    require: '^chapterEnrich',
    replace: false,
    link: function (scope, element, attrs, chapterEnrichCtrl) {
      var selected = null;

      scope.$watch('active', function() {
        if(scope.active) {
          if (scope.items.length > 0) {
            scope.nav(scope.items[0]);
          } else {
            scope.nav();
          }
        }
      });

      scope.isSelected = function (m) {
        return m == selected;
      };

      scope.$watch('height', function (height) {
        if (height != null) {
          //TODO: fix get scroll view of this element
          angular.element('.links .scroll-view').height(height);
        }
      });

      scope.nav = function (e) {
        selected = e;
        debug('Navigate to ' + JSON.stringify(e.title));
        chapterEnrichCtrl.setContent({item:e, type:scope.type});
      };

      function debug(msg) {
        $log.debug('[Chapter (directive)] ' + msg)
      }
    },
    templateUrl: 'partials/directives/dimension-list.html'
  }
}
