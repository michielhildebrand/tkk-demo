'use strict';

angular.module('EventsBus', ['ngResource']).factory('eventsBus', ['$rootScope', eventsBusService]);

/** Used to broadcast and listen for global events */
function eventsBusService($rootScope) {
  return {
    publish: function (channel, data) {
      //console.log('publishing on \'' + channel + '\'');
      $rootScope.$broadcast(channel, data);
    },
    subscribe: function ($scope, channel, handler) {
      //console.log('subscribing to \'' + channel + '\'');
      $scope.$on(channel, function (event, data) {
        handler(data);
      })
    }
  }
}
