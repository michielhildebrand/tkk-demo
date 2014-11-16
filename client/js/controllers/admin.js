'use strict';

angular.module('AdminCtrl', []).controller('AdminCtrl', ['$scope', '$http', 'Config', '$log', adminCtrl]);

function adminCtrl($scope, $http, Config, $log) {
    
    $http.get(Config.seed).success(function(data) {
        $scope.videos = data;
    });

  function debug(msg) {
    $log.debug('[Admin (ctrl)] ' + msg)
  }

}
