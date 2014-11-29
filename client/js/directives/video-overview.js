'use strict';

angular.module('app.video-overview', []).directive('videoOverview', ['$state', '$log', '$rootScope', 'Model', 'contentFiltering', videoOverviewDirective]);

function videoOverviewDirective($state, $log, $rootScope, Model, contentFiltering) {
  return {
    restrict: 'E',
    scope: {
      'video': '='
    },
    replace: false,
    link: function (scope, element, attrs) {
      scope.personalized = {};

      // TODO: get chapter width dynamically
      var chapterWidth = 153;
      var scrollViewWidth = element.parent().width();
      var scrollWidth = scope.video.chapters.length * chapterWidth;
      $(element.children()[0]).width(scrollViewWidth);
      $(element.children()[0].children[0]).width(scrollWidth);

      scope.$watch(
        function() {
          return scope.video.chapters
        },
        function(chapters) {
          scope.personalized = {};
          if(chapters) {
            personalize(chapters);
          }
        }
      );

      scope.play = function (chId) {
        $state.go('play', {user: Model.getUser(), videoId: scope.video.id, chId: chId});
      };

      function personalize(chapters) {
        var chapterIDs = _(chapters).map(function(c) {return c.id});
        if($rootScope.personalizing) {
          setTimeout(function() {personalize(chapters)}, 1000);
        } else {
          $rootScope.personalizing = true;
          debug('personalizing '+scope.video.id);
          contentFiltering.personalize({"action":"seed_content_filtering"}, {"chapters":chapterIDs}, 
            function (cfResp) {
              $rootScope.personalizing = false;
              if(cfResp.results) {
                var personalized = {};
                debug('Personalization response, chapters: ' + cfResp.results.length);
                _(cfResp.results).each(function(r) {
                  if(r.Degree>0) {
                    personalized[r.chapter] = r.Degree;
                  }
                })
                scope.personalized = personalized;
              } 
            },
            function() {
              debug('Personalization failed')
              $rootScope.personalizing = false;
            }
          )
        }
      }

      function debug(msg) {
        $log.debug('[Dimension (directive)] ' + msg)
      }

    },
    templateUrl: 'partials/directives/video-overview.html'
  }
}
