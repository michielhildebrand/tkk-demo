'use strict';

angular.module('EntityProxy', ['ngResource']).factory('entityProxy', ['$resource', 'CONFIG', entityProxyResource]);

function entityProxyResource($resource, CONFIG) {
  return $resource(CONFIG.ENTITY_PROXY + '?url=:loc&lang=:lang', { loc: '@loc', lang: 'en' },
    {
      get: {
        method: 'GET'
      }
    }
  );
}
