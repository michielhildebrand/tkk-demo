'use strict';

angular.module('app.information-card', []).directive('informationCard', ['Data', informationCardDirective]);

function informationCardDirective(Data) {
  return {
    restrict: 'E',
    scope: {
      'props': '=',
      'browse': '&'
    },
    replace: false,
    link: function (scope, element, attrs) {

    },
    controller: function ($scope, $element) {
      var interestingProps = ['label', 'thumb', 'comment', 'birthDate', 'deathDate', 'birthPlace', 'deathPlace',
        'nationality', 'profession', 'style', 'population'];

      _(interestingProps).map(function (prop) {
        var guessedValue = firstValue(_.property(prop)($scope.props));
        $scope[prop] = guessedValue;
      });

      function firstValue(prop) {
        var v = {value: '', uri: ''};
        if (prop) {
          if (prop.length > 0) {
            if (prop[0].value) {
              v = {
                value: prop[0].value,
                uri: prop[0].uri || ''
              }
            } else {
              v = {
                value: prop[0],
                uri: ''
              }
            }
          }
        }
        return v;
      }

      var browse = $scope.browse();

      $scope.nav = function(uri) {
        browse(uri);
      }
    },
    templateUrl: 'partials/directives/information-card.html'
  }
}
