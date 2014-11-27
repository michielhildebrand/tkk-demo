'use strict';

var informationCard = angular.module('app.information-card', []);

informationCard.directive('informationCard', ['$sce', '$filter','$state','Model','$log', informationCardDirective]);

function informationCardDirective($sce, $filter, $state, Model, $log) {
  return {
    restrict: 'E',
    scope: {
      'content': '='
    },
    replace: false,
    link: function (scope, element, attrs) {

      scope.$watch('content', function (newContent) {
        scope.external = null;
        if (newContent != null) {
          scope.type = newContent.type;
          scope.item = newContent.item;
        } else {
          scope.type = null;
          scope.item = null;
        }
      });

      /*
      scope.nav = function (prop) {
        navigate(prop);
      };
      */

      function debug(msg) {
        $log.debug('[Information Card (directive)] ' + msg)
      }

      scope.toggleExternalUrl = function(url) {
        console.log('show: ', url);
        if(url) {
          scope.external = $sce.trustAsResourceUrl(url);
        } else {
          scope.external = null;
        }
      };

      scope.play = function (videoId, chapterId) {
        console.log('play ', videoId, chapterId);
        var id = 1;
        $state.go('play', {user: Model.getUser(), videoId: videoId, idx: id});
      };

    },

    templateUrl: 'partials/directives/information-card.html'
  }
}

informationCard.filter('rawAttribute', function() {
  var templateProps = ['birthDate','birthPlace','deathDate','deathPlace'];

  return function( items ) {
    var filtered = {};
    _(items).forEach(function(value, key) {
      if(! _.contains(templateProps, key) ) {
        filtered[key] = value;
      };
    });
    return filtered;
  };
});