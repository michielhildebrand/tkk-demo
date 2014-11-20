'use strict';

angular.module('DocumentProxy', ['ngResource']).factory('documentProxy', ['$resource', 'Config', documentProxyResource]);

function documentProxyResource($resource, Config) {
  return $resource(Config.DOCUMENT_PROXY, { },
    {
      scrape: {
        url: Config.DOCUMENT_PROXY + '?url=:url',
        params: {
          url: "@url"
        }
      }
    }
  );
}
