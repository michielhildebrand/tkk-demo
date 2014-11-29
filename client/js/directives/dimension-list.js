'use strict';

angular.module('app.dimension-list', []).directive('dimensionList', ['$log', 'Model', 'contentFiltering', dimensionListDirective]);

function dimensionListDirective($log, Model, contentFiltering) {
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
      scope.personalized = {}

      scope.$watch(
        function() {
          return scope.items
        },
        function(newItems) {
          scope.personalized = {};
          console.log('p', newItems, scope.type);
          if(scope.type=='article') {
            personalize(newItems)
          }
        }
      );

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
        if(e) {
          debug('Navigate to ' + JSON.stringify(e.title));
        }
        chapterEnrichCtrl.setContent({item:e, type:scope.type});
      };

      function personalize(items) {
        console.log('personalizing');
        contentFiltering.personalize({"source":items}, function (cfResp) {
          console.log(cfResp);
          if(cfResp.results) {
            debug('Personalization response, posts: ' + cfResp.results.length);
            _(cfResp.results).each(function(r) {
              scope.personalized[r.micropostURL] = r.Degree;
            })
          } 
        })
      }

      function debug(msg) {
        $log.debug('[Chapter (directive)] ' + msg)
      }
    },
    templateUrl: 'partials/directives/dimension-list.html'
  }
}
