'use strict';

angular.module('EuropeanaApi', ['ngResource']).factory('europeanaApi', ['$resource', 'CONFIG', europeanaApiResource]);

function europeanaApiResource($resource, CONFIG) {
  return $resource(CONFIG.EUROPEANA_API + '?query=:query&wskey=:wskey', { query: '@query', wskey: 'hb8sGDBPe' },
    {
      get: {
        method: 'GET'
      }
    }
  );
}
