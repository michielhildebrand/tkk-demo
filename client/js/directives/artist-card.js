'use strict';

angular.module('app.artist-card', []).directive('artistCard', ['Data', bookmarkingDirective]);

function bookmarkingDirective(Data) {
  return {
    restrict: 'E',
    scope: {
      'props': '='
    },
    replace: false,
    link: function (scope, element, attrs) {

    },
    controller: function ($scope, $element) {
      $scope.label = firstValue($scope.props.label);
      $scope.thumbnail = $scope.props.thumb[0];
      $scope.abstract = firstValue($scope.props.comment);

      function firstValue(prop) {
        return (prop.length > 0) ? prop[0].value : '';
      }
    },
    templateUrl: 'partials/directives/artist-card.html'
  }
}
