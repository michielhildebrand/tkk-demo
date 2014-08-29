'use strict';

angular.module('EuropeanaApi', ['ngResource']).factory('europeanaApi', ['$resource', 'Config', europeanaApiResource]);

function europeanaApiResource($resource, Config) {
  return $resource(Config.EUROPEANA_API + '?query=:query&wskey=:wskey', { query: '@query', wskey: 'hb8sGDBPe' },
    {
      get: {
        method: 'GET'
      }
    }
  );
}
