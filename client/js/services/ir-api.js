'use strict';

angular.module('IRApi', ['ngResource']).factory('irApi', ['$resource', 'Config', irApiResource]);

function irApiResource($resource, Config) {
  return $resource(Config.IR_API + '?q=:query&thd=yes', {query: '@query'},
    {
      search: {
        method: 'GET'
      }
    }
  );
}
