'use strict';

angular.module('EventsBus', ['ngResource']).factory('eventsBus', ['$rootScope', eventsBusService]);

/** Used to broadcast and listen for global events */
function eventsBusService($rootScope) {
  return {
    publish: function (channel, data) {
      //console.log('publishing on \'' + channel + '\'');
      $rootScope.$emit(channel, data);
    },
    subscribe: function (channel, handler) {
      //console.log('subscribing to \'' + channel + '\'');
      $rootScope.$on(channel, function (event, data) {
        handler(data);
      })
    }
  }
}
