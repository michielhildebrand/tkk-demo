'use strict';

angular.module('app.information-card', []).directive('informationCard', ['Model', informationCardDirective]);

function informationCardDirective(Model) {
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
        var guessedValue = firstEntity(_.property(prop)($scope.props));
        $scope[prop] = guessedValue;
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

      $scope.metadata = $scope.props.entities;

      var browse = $scope.browse();

      $scope.nav = function(e) {
        browse(e, false);
      }
    },
    templateUrl: 'partials/directives/information-card.html'
  }
}
