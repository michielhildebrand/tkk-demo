'use strict';

angular.module('LinkedtvSparql', ['ngResource']).factory('linkedtvSparql', ['$resource', 'Config', linkedtvSparqlResource]);

function linkedtvSparqlResource($resource, Config) {

  return $resource(Config.LINKEDTV_SPARQL, { },
    {
      getSparqlResults: {
        method: 'GET',
        url: Config.LINKEDTV_SPARQL,
        params: {
          query: "@query",
          format: 'json'
        }
      }
    }
  );
}
