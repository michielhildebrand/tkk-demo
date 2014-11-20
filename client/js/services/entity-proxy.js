'use strict';

angular.module('EntityProxy', ['ngResource']).factory('entityProxy', ['$resource', 'Config', entityProxyResource]);

function entityProxyResource($resource, Config) {
  return $resource(Config.ENTITY_PROXY, { },
    {
      get: {
        method: 'GET',
        url: Config.ENTITY_PROXY + '?url=:url&lang=:lang',
        params: {
          url: "@url",
          lang: "@lang"
        }
      },
      getList: {
        method: 'GET',
        url: Config.ENTITY_PROXY + '?urls=:urls&lang=:lang',
        params: {
          urls: "@urls",
          lang: "@lang"
        }
      }
    }
  );
}
