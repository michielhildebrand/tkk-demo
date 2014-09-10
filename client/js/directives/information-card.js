'use strict';

angular.module('app.information-card', []).directive('informationCard', ['$sce', informationCardDirective]);

function informationCardDirective($sce) {
  return {
    restrict: 'E',
    scope: {
      'props': '='
    },
    replace: false,
    link: function (scope, element, attrs) {
      scope.external = false;
      scope.externalUrl = "";
      
      var interestingProps = ['url','thumb','title','comment', 
        'birthDate', 'deathDate', 'birthPlace', 'deathPlace',
        'nationality', 'profession', 'style', 'predecessor', 'successor', 
        'activeSince', 'knownFor', 'presents','guestedIn', 'locatedIn', 'population', 
        'dcTitle', 'dcCreator','dcDate','dcDescription','dcFormat','dcSource','edmLandingPage'
      ];

      scope.$watch('props', function (newProps) {
        scope.external = false;
        if (newProps != null) {
          //console.log('new props', newProps);

          _(interestingProps).map(function (prop) {
            //console.log('fetching', prop);
            scope[prop] = firstEntity(_.property(prop)(newProps));
          });
          //console.log(scope);
          scope.metadata = newProps.metadata;
        }
      });
      
      scope.toggleExternalUrl = function(url) {
        if(url) {
          scope.externalUrl = $sce.trustAsResourceUrl(url);
        }  
        scope.external = !scope.external;
      };

      function firstEntity(prop) {
        var e = {value: '', uri: ''};
        if (prop) {
          if (Array.isArray(prop) && prop.length > 0) {
            //console.log('property array: ', prop);
            if (prop[0].value) {
              e = {
                value: prop[0].value,
                uri: prop[0].uri || ''
              }
            } else {
              e = {
                value: prop[0],
                uri: ''
              }
            }
          } else if (prop.def && prop.def.length > 0) {
            //console.log('property object: ', prop);
            e = {
              value: prop.def[0],
              uri: ''
            }
          } else {
            //console.log('property entity not found', prop);
          }
        }
        return e;
      }
    },
    templateUrl: 'partials/directives/information-card.html'
  }
}
