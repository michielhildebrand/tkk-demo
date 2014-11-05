'use strict';

angular.module('app.information-card', []).directive('informationCard', ['$sce', '$log', informationCardDirective]);

function informationCardDirective($sce, $log) {
  return {
    restrict: 'E',
    scope: {
      'props': '=',
      'navigate': '&'
    },
    replace: false,
    link: function (scope, element, attrs) {
      scope.external = false;
      scope.externalUrl = "";

      var interestingProps = ['url', 'thumb', 'title', 'comment',
        'birthDate', 'deathDate', 'birthPlace', 'deathPlace',
        'nationality', 'profession', 'style', 'predecessor', 'successor',
        'activeSince', 'knownFor', 'presents', 'guestedIn', 'locatedIn', 'population',
        'dcTitle', 'dcCreator', 'dcDate', 'dcDescription', 'dcFormat', 'dcSource', 'edmLandingPage',
        'playChapter',
        'owner', 'openingDate', 'location', 'architect', 'builtBy', 'builtYear', 'achitecture',
        'chairman', 'focus', 'formationYear', 'founder', 'foundingYear', 'industry', 'location', 'locationCity', 'numberEmployees'
      ];

      scope.$watch('props', function (newProps) {
        scope.external = false;
        if (newProps != null) {
          _(interestingProps).map(function (prop) {
            scope[prop] = cleanDate(prop, firstEntity(_.property(prop)(newProps)));
          });
          //console.log(scope);
          scope.metadata = newProps.metadata;
        }
      });

      scope.toggleExternalUrl = function (url) {
        if (url != null) {
          scope.externalUrl = $sce.trustAsResourceUrl(url);
        }
        scope.external = !scope.external;
      };

      var navigate = scope.navigate();
      scope.nav = function (prop) {
        navigate(prop);
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
          }
        }
        return e;
      }

      function cleanDate(propName, prop) {
        var dateProps = ['birthDate', 'deathDate', 'activeSince', 'dcDate'];
        if (_(dateProps).contains(propName)) {
          var i = prop.value.indexOf('+');
          prop.value = prop.value.substring(0, i);
        }
        return prop;
      }

      function debug(msg) {
        $log.debug('[Information Card (directive)] ' + msg)
      }
    },
    templateUrl: 'partials/directives/information-card.html'
  }
}
