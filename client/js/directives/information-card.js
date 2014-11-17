'use strict';

angular.module('app.information-card', []).directive('informationCard', ['$sce', '$filter', '$log', informationCardDirective]);

function informationCardDirective($sce, $log) {
  return {
    restrict: 'E',
    scope: {
      'content': '=',
      'navigate': '&'
    },
    replace: false,
    link: function (scope, element, attrs) {

      scope.$watch('content', function (newContent) {
        if (newContent != null) {

          if (newContent.type == 'entity') {
            prepareEntity(newContent.content);
          }
          else if (newContent.type == 'europeana') {
            prepareArtwork(newContent.content);
          }
        }
      });

      function prepareEntity(entity) {
        var templateProps = ['birthDate','birthPlace','deathDate','deathPlace'];
        var as = entity.attributes;
        var attributes = {};

        // must have attributes
        scope.title = (as.label && as.label.length>0) ? as.label[0].value : entity.title;
        scope.url = {label:'Wikipedia', value:entity.locator};
        scope.image = (as.thumb && as.thumb.length>0) ? as.thumb[0] : null;
        scope.subtitle = (as.type && as.type.length>0) ? as.type.join(', ') : null;
        scope.description = (as.comment && as.comment.length>0) ? as.comment[0].value : "";

        // template attributes
        var ts = {}
        _(templateProps).forEach(function (prop) {
          ts[prop] = cleanDate(prop, as[prop]);
        });
        scope.template = ts;

        // remaining attributes
        _(as).forEach(function(value,key) {
          if (!_(['label', 'thumb', 'comment']).contains(key) && !_(templateProps).contains(key)) {
            if( (Array.isArray(value) && value.length > 0) || value != '') {
              attributes[key] = cleanDate(key, value);
            }
          }
        });
        scope.attributes = attributes;
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

      var navigate = scope.navigate();
      scope.nav = function (prop) {
        navigate(prop);
      };


      function cleanDate(propName, props) {
        var dateProps = ['birthDate', 'deathDate', 'activeSince'];
        if (_(dateProps).contains(propName)) {
          props = _(props).map(function(prop) {
            var i = prop.indexOf('+');
            return prop.substring(0, i);
          });
        }
        return props;
      }

      function debug(msg) {
        $log.debug('[Information Card (directive)] ' + msg)
      }
    },
    templateUrl: 'partials/directives/information-card.html'
  }
}
