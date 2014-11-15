'use strict';

angular.module('AdminCtrl', []).controller('AdminCtrl', ['$scope', 'Model', '$log', adminCtrl]);

function adminCtrl($scope, Model, $log) {

  $scope.$watch(
      function () {
        return Model.getVideos();
      },
      function (newVideos) {
        console.log(newVideos);
        if (newVideos.length > 0) {
          $scope.videos = newVideos;
        }
      }
  );

  function debug(msg) {
    $log.debug('[Admin (ctrl)] ' + msg)
  }

}
