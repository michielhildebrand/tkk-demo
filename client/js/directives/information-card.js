'use strict';

angular.module('app.information-card', []).directive('informationCard', [informationCardDirective]);

function informationCardDirective() {
  return {
    restrict: 'E',
    scope: {
      'props': '='
    },
    replace: false,
    link: function (scope, element, attrs) {
      var interestingProps = ['label', 'thumb', 'comment', 'birthDate', 'deathDate', 'birthPlace', 'deathPlace',
        'nationality', 'profession', 'style','predecessor','successor', 'activeSince','knownFor','presents','guestedIn',
        'locatedIn', 'population'];

      scope.$watch('props', function(newProps) {
        if (newProps != null) {
          _(interestingProps).map(function (prop) {
            scope[prop] = firstEntity(_.property(prop)(newProps));
          });
          scope.metadata = newProps.metadata;
        }
      });

      function firstEntity(prop) {
        var e = {value: '', uri: ''};
        if (prop) {
          if (prop.length > 0) {
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
          }
        }
        return e;
      }
    },
    templateUrl: 'partials/directives/information-card.html'
  }
}
