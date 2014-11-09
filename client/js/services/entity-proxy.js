'use strict';

angular.module('EntityProxy', ['ngResource']).factory('entityProxy', ['$resource', 'Config', entityProxyResource]);

function entityProxyResource($resource, Config) {
  return $resource(Config.ENTITY_PROXY, { },
    {
      get: {
        method: 'GET',
        url: Config.ENTITY_PROXY + '?url=:loc&lang=:lang',
        params: {
          loc:"@loc",
          lang:"nl"
        }
      },
      getList: {
        method: 'GET',
        url: Config.ENTITY_PROXY + '?urls=:urls&lang=:lang',
        params: {
          urls:"@urls",
          lang:"nl"
        }
      }
    }
  );
}
