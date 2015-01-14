'use strict';

angular.module('AdminCtrl', []).controller('AdminCtrl', ['$scope', '$http', '$window', 'Config', '$log', adminCtrl]);

function adminCtrl($scope, $http, $window, Config, $log) {
  var proxy = Config.DOCUMENT_PROXY + '/' + Config.db;
  
  $scope.importing = false;

  $scope.data = {
  	showDelete: false,
  	showReorder: false,
  	videos: []
  }

  $http.get(proxy+'/videos').success(function(data) {
    $scope.data.videos = data;
  });

  $scope.removeVideo = function(index, id) {
  	$scope.data.videos.splice(index,1)
  	$http.get(proxy+'/' + id + '/remove').success(function(data) {
  		debug('removed '+id)
  	})
  }

	$scope.addVideo = function(o) {
		var id = o.id;
		console.log(id);
  	$http.get(proxy+'/'+id+'/add')
    .success(function(data) {
  		$scope.data.videos.push(data);
  	})
    .error(function(data) {
      window.alert(id+" not known");
    });
  }  

  $scope.reorderVideo = function(video, from, to) {
    $scope.data.videos.splice(from, 1);
    $scope.data.videos.splice(to, 0, video);
  }

  $scope.importAll = function() {
    if(!$scope.importing) {
      $scope.importing = true;
      $http.get(proxy+'/update').success(function(data) {
        $scope.data.videos = data;
        $scope.importing = false;
      })
    }
  }

  $scope.import = function(index, id) {
    if(!$scope.importing) {
      $scope.importing = index;
      $http.get(proxy+'/'+id+'/update').success(function(data) {
        $scope.data.videos[index] = data;
        $scope.importing = false;
      })
    }
  }

  $scope.openVideoData = function(id) {
    $window.location.href = 'video/'+id+'.json';
  }

  $scope.isImporting = function(index) {
    if($scope.importing==true) {
      return true;
    } else if ($scope.importing===index) {
      return true
    }
    else {
      return false
    }
  }


  function debug(msg) {
    $log.debug('[Admin (ctrl)] ' + msg)
  }

}
