'use strict';

angular.module('app.information-card', []).directive('informationCard', ['Data', informationCardDirective]);

function informationCardDirective(Data) {
  return {
    restrict: 'E',
    scope: {
      'props': '='
    },
    replace: false,
    link: function (scope, element, attrs) {

    },
    controller: function ($scope, $element) {
      var interestingProps = ['label', 'thumb', 'comment', 'birthDate', 'deathDate', 'birthPlace', 'deathPlace',
        'nationality', 'profession', 'style'];

      _(interestingProps).map(function (prop) {
        var guessedValue = firstValue(_.property(prop)($scope.props));
        $scope[prop] = guessedValue;
      });

      function firstValue(prop) {
        var v = '';
        if (prop) {
          if (prop.length > 0) {
            if (prop[0].value) {
              v = prop[0].value;
            } else {
              v = prop[0];
            }
          }
        }
        return v;
      }
    },
    templateUrl: 'partials/directives/information-card.html'
  }
}
