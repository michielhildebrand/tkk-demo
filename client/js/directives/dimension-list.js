'use strict';

angular.module('app.dimension-list', []).directive('dimensionList', ['$log', 'Model', dimensionListDirective]);

function dimensionListDirective($log, Model) {
  return {
    restrict: 'E',
    scope: {
      items: '=',
      type: '=',
      linked: '='
    },
    require: '^chapterEnrich',
    replace: false,
    link: function (scope, element, attrs, chapterEnrichCtrl) {
      var selected = null;

      scope.isSelected = function (m) {
        return m == selected;
      };

      scope.$watch('linked', function (e) {
        if (e != null) scope.nav(e, true);
      });

      scope.nav = function (e, linked) {
        selected = e;
        debug('Navigate to ' + JSON.stringify(e));
        chapterEnrichCtrl.setContent({content:e, type:scope.type}, linked);
      };

      function debug(msg) {
        $log.debug('[Chapter (directive)] ' + msg)
      }
    },
    templateUrl: 'partials/directives/dimension-list.html'
  }
}
