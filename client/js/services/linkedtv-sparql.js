'use strict';

angular.module('LinkedtvSparql', ['ngResource']).factory('linkedtvSparql', ['$resource', 'Config', linkedtvSparqlResource]);

function linkedtvSparqlResource($resource, Config) {

  var chapterQuery =
      'PREFIX linkedtv: <http://data.linkedtv.eu/ontologies/core#> \
        PREFIX ma: <http://www.w3.org/ns/ma-ont#> \
        PREFIX nsa: <http://multimedialab.elis.ugent.be/organon/ontologies/ninsuna#> \
        PREFIX oa: <http://www.w3.org/ns/oa#> \
        PREFIX prov: <http://www.w3.org/ns/prov#> \
        SELECT DISTINCT ?chapter ?start ?end ?label \
        WHERE { \
          ?mediafragment ma:isFragmentOf <http://data.linkedtv.eu/media/8a8187f2-3fc8-cb54-0140-7dccd76f0001> . \
          ?annotation oa:hasTarget ?mediafragment . \
          ?annotation oa:hasBody ?chapter . \
          ?chapter a linkedtv:Chapter . \
          ?annotation prov:wasAttributedTo <http://data.linkedtv.eu/organization/SV/EditorTool> . \
          ?mediafragment nsa:temporalStart ?start . \
          ?mediafragment nsa:temporalEnd ?end . \
          ?chapter rdfs:label ?label . \
        }  ORDER BY ?start';

  var entityQuery =
      'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \
        PREFIX linkedtv: <http://data.linkedtv.eu/ontologies/core#> \
            PREFIX ma: <http://www.w3.org/ns/ma-ont#> \
            PREFIX oa: <http://www.w3.org/ns/oa#> \
            PREFIX prov: <http://www.w3.org/ns/prov#> \
            SELECT ?entity ?start ?end \
                WHERE { \
                ?mediafragment ma:isFragmentOf <http://data.linkedtv.eu/media/8a8187f2-3fc8-cb54-0140-7dccd76f0001> . \
        ?mediafragment a ma:MediaFragment . \
            ?annotation oa:hasTarget ?mediafragment . \
            ?annotation oa:hasBody ?item  . \
            ?annotation prov:wasAttributedTo <http://data.linkedtv.eu/organization/SV/EditorTool> . \
        ?item rdf:type linkedtv:Entity . \
            ?item ma:locator ?entity . \
            ?mediafragment nsa:temporalStart ?start . \
            ?mediafragment nsa:temporalEnd ?end . \
      } ORDER BY ?start';

  return $resource(Config.LINKEDTV_SPARQL, { },
    {
      getChapters: {
        method: 'GET',
        url: Config.LINKEDTV_SPARQL,
        params: {
          query: chapterQuery,
          format: 'json'
        }
      },
      getEntities: {
        method: 'GET',
        url: Config.LINKEDTV_SPARQL,
        params: {
          query: entityQuery,
          format: 'json'
        }
      }
    }
  );
}
