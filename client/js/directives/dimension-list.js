'use strict';

angular.module('app.dimension-list', []).directive('dimensionList', ['$log', '$rootScope', 'Model', 'Tracker', 'contentFiltering', dimensionListDirective]);

function dimensionListDirective($log, $rootScope, Model, Tracker, contentFiltering) {
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
          return Tracker.enabled();
        },
        function(tracking) {
          if(tracking && scope.type=='article' && scope.items) {
            personalize(scope.items)
          }
        }
      )

      scope.$watch(
        function() {
          return scope.items;
        },
        function(newItems) {
          scope.personalized = {};
          if(scope.type=='article' && Tracker.enabled()) {
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
        if($rootScope.personalizing) {
          debug('waiting for personalizer to finish');
          setTimeout(function() {personalize(items)}, 1000);
        } else {
          $rootScope.personalizing = true;
          debug('personalizing');
          contentFiltering.personalize({"action":"content_filtering"}, {"source":items}, 
            function (cfResp) {
              $rootScope.personalizing = false;
              if(cfResp.results) {
                var personalized = {};
                debug('Personalization response, posts: ' + cfResp.results.length);
                _(cfResp.results).each(function(r) {
                  personalized[r.micropostURL] = r.Degree;
                })
                scope.personalized = personalized;
              } 
            },
            function() {
              $rootScope.personalizing = false;
            }
          )
        }
      }

      function debug(msg) {
        $log.debug('[Dimension (directive)] ' + msg)
      }
    },
    templateUrl: 'partials/directives/dimension-list.html'
  }
}
