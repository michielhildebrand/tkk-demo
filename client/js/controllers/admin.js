'use strict';

angular.module('AdminCtrl', []).controller('AdminCtrl', ['$scope', '$http', 'Config', '$log', adminCtrl]);

function adminCtrl($scope, $http, Config, $log) {
  $scope.data = {
  	showDelete: false,
  	showReorder: false,
  	videos: []
  }

  $http.get(Config.seed).success(function(data) {
    $scope.data.videos = data;
  });

  $scope.removeVideo = function(index, id) {
  	$scope.data.videos.splice(index,1)
  	$http.get(Config.DOCUMENT_PROXY+'/rbb/remove/'+id).success(function(data) {
  		debug('removed '+id)
  	})
  }

	$scope.addVideo = function() {
		var id = $scope.newVideo;
		console.log(id);
  	$http.get(Config.DOCUMENT_PROXY+'/rbb/add/'+id).success(function(data) {
  		$scope.data.videos.push(data);
  	})
  }  

  $scope.reorderVideo = function(id, from, to) {

  }



  function debug(msg) {
    $log.debug('[Admin (ctrl)] ' + msg)
  }

}
