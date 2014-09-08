'use strict';

angular.module('EntityProxy', ['ngResource']).factory('entityProxy', ['$resource', 'Config', entityProxyResource]);

function entityProxyResource($resource, Config) {
  return $resource(Config.ENTITY_PROXY + '?url=:loc&lang=:lang', { loc: '@loc', lang: 'nl' },
    {
      get: {
        method: 'GET'
      }
    }
  );
}
