'use strict';

var informationCard = angular.module('app.information-card', []);

informationCard.directive('informationCard', ['$sce', '$filter', '$log', informationCardDirective]);

function informationCardDirective($sce, $log) {
  return {
    restrict: 'E',
    scope: {
      'content': '='
    },
    replace: false,
    link: function (scope, element, attrs) {

      scope.$watch('content', function (newContent) {
        if (newContent != null) {
          scope.item = newContent.item;
          scope.type = newContent.type;
        }
      });


      scope.templateProp = function(prop) {

      };

      function prepareEntity(entity) {
        scope.item = entity;
      }

      function prepareArtwork(artwork) {
        // must have attributes
        scope.title = (artwork.dcTitle) ? artwork.dcTitle.def[0] : artwork.title[0];
        scope.url = artwork.url ? {label:artwork.url[0].value, value:artwork.url[0].uri} : "";
        scope.image = (artwork.thumb && artwork.thumb.length>0) ? artwork.thumb[0] : null;
        scope.subtitle = artwork.dcSource ? artwork.dcSource.def[0] :
          (artwork.dcPublisher ? artwork.dcPublisher.def[0] : "");
        scope.description = artwork.dcDescription ? artwork.dcDescription.def[0] : "";

        // templates
        scope.template = [];

        // attributes dublin core
        var as = {};
        _(artwork).forEach(function(value,key) {
          if (!_(['dcTitle','dcSource','dcPublisher',
              'dcDescription','dctermsProvenance','dcIdentifier']).contains(key)) {
            if(key.substring(0,2)=='dc') {
              var newKey = key.substring(2);
              as[newKey] = value.def;
            }
          }
        });
        scope.attributes = as;
      }

      /*
      scope.nav = function (prop) {
        navigate(prop);
      };
      */

      function debug(msg) {
        $log.debug('[Information Card (directive)] ' + msg)
      }
    },

    templateUrl: 'partials/directives/information-card.html'
  }
}

informationCard.filter('rawAttribute', function() {
  var templateProps = ['birthDate','birthPlace','deathDate','deathPlace'];

  return function( items ) {
    var filtered = {};
    return _(items).forEach(function(value, key) {
      if(!_(templateProps).contains(key)) {
        filtered[key] = value;
      };
    });
    return filtered;
  };
});