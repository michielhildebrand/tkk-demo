'use strict';

angular.module('EuropeanaApi', ['ngResource']).factory('europeanaApi', ['$resource', 'Config', europeanaApiResource]);

function europeanaApiResource($resource, Config) {
  return $resource(Config.EUROPEANA_API, { },
    {
      search: {
        method: 'GET',
        url: Config.EUROPEANA_API + '/search.json?query=:query&wskey=:wskey',
        params: {
          query: '@query',
          wskey: 'hb8sGDBPe'
        }
      },
      get: {
        method: 'GET',
        url: Config.EUROPEANA_API + '/record/:id0/:id1.json?profile=:profile&wskey=:wskey',
        params: {
          id0: '@id0',
          id1: '@id1',
          profile: 'rich',
          wskey: 'hb8sGDBPe'
        }
      }
    }
  );
}
