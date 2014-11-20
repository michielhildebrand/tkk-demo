'use strict';

angular.module('VideoAdminCtrl', []).controller('VideoAdminCtrl', ['$scope', '$stateParams', '$http', 'linkedtvSparql', '$log', 'Config', 'Modeller', videoAdminCtrl]);

function videoAdminCtrl($scope, $stateParams, $http, linkedtvSparql, $log, Config, Modeller) {
  $scope.curated = true;
  $scope.max = 10;
  $scope.videoId = $stateParams.videoId;

  function chapterQuery(curated) {
    var query = '\
        PREFIX linkedtv: <http://data.linkedtv.eu/ontologies/core#> \
        PREFIX ma: <http://www.w3.org/ns/ma-ont#> \
        PREFIX nsa: <http://multimedialab.elis.ugent.be/organon/ontologies/ninsuna#> \
        PREFIX oa: <http://www.w3.org/ns/oa#> \
        PREFIX prov: <http://www.w3.org/ns/prov#> \
        SELECT DISTINCT ?chapter ?start ?end ?label ?poster \
        WHERE { \
            ?mediafragment ma:isFragmentOf <http://data.linkedtv.eu/media/' + $scope.videoId + '> . \
            ?annotation oa:hasTarget ?mediafragment . \
            ?annotation oa:hasBody ?chapter . \
            ?chapter a linkedtv:Chapter . \
            ?mediafragment nsa:temporalStart ?start . \
            ?mediafragment nsa:temporalEnd ?end . \
            ?chapter rdfs:label ?label . \
            OPTIONAL {?chapter linkedtv:hasPoster ?poster }';
    if (curated) {
      query += '?annotation prov:wasAttributedTo <http://data.linkedtv.eu/organization/SV/EditorToolv2> . ';
    }
    query += '} ORDER BY ?start';
    return query;
  }

  function entityQuery(curated) {
    var query = '\
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> \
        PREFIX linkedtv: <http://data.linkedtv.eu/ontologies/core#> \
        PREFIX ma: <http://www.w3.org/ns/ma-ont#> \
        PREFIX oa: <http://www.w3.org/ns/oa#> \
        PREFIX prov: <http://www.w3.org/ns/prov#> \
        SELECT ?entity ?start ?end ?label \
        WHERE { \
            ?mediafragment ma:isFragmentOf <http://data.linkedtv.eu/media/' + $scope.videoId + '> . \
            ?mediafragment a ma:MediaFragment . \
            ?annotation oa:hasTarget ?mediafragment . \
            ?annotation oa:hasBody ?item  . \
            ?item rdf:type linkedtv:Entity . \
            ?item ma:locator ?entity . \
            ?item rdfs:label ?label . \
            ?mediafragment nsa:temporalStart ?start . \
            ?mediafragment nsa:temporalEnd ?end . ';
    if (curated) {
      query += '?annotation prov:wasAttributedTo <http://data.linkedtv.eu/organization/SV/EditorTool> . ';
    }
    query += '} ORDER BY ?start';
    return query;
  }

  function enrichmentQuery(type, curated) {
    var query = '\
        PREFIX ma: <http://www.w3.org/ns/ma-ont#> \
        PREFIX oa: <http://www.w3.org/ns/oa#> \
        PREFIX dc: <http://purl.org/dc/elements/1.1/> \
        PREFIX linkedtv: <http://data.linkedtv.eu/ontologies/core#> \
        SELECT ?url ?type ?start ?end\
        WHERE { \
            ?mediafragment a ma:MediaFragment . \
            ?mediafragment ma:isFragmentOf <http://data.linkedtv.eu/media/' + $scope.videoId + '> . \
            ?annotation oa:hasTarget ?mediafragment . \
            ?annotation oa:hasBody ?item . \
            ?item ma:locator ?url . \
            ?mediafragment nsa:temporalStart ?start . \
            ?mediafragment nsa:temporalEnd ?end .';
    if (curated) {
      query += '?annotation prov:wasAttributedTo <http://data.linkedtv.eu/organization/SV/EditorToolv2> . ';
      query += '?annotation oa:motivatedBy ?motivation . FILTER (?motivation = linkedtv:'+type+') .';
    } else {
      query += '?annotation oa:motivatedBy oa:linking . ';
      query += '?item dc:type linkedtv:' + type + '.';
    }
    query += '} ORDER BY ?start';

    return query;
  }

  function chapterMap(chapters) {
    return _.map(chapters, function (e) {
      var url = e.chapter.value;
      var id = url.substr(url.lastIndexOf('/') + 1);
      var startTime = e.start.value * 1000,
        endTime = e.end.value * 1000;

      return {
        "id": id,
        "startTime": startTime,
        "endTime": endTime,
        "duration": endTime - startTime,
        "title": e.label.value
      };
    });
  }

  function chapterEntityInclude(chapters, entities) {
    return _.map(chapters, function (chapter) {
      chapter.fragments = [];

      _.each(entities, function (e) {
        var startTime = e.start.value * 1000,
          endTime = e.end.value * 1000;

        /*if (startTime > chapter.endTime) {
         return chapter;
         }*/

        if (startTime > chapter.startTime && endTime <= chapter.endTime) {
          var labelValue = e.label.value.substring(e.label.value.indexOf(':') + 1).trim();

          chapter.fragments.push({
            title: labelValue,
            "locator": e.entity.value,
            "startTime": startTime,
            "endTime": endTime,
            "duration": endTime - startTime
          })
        }
      });
      return chapter;
    });
  }

  function chapterEnrichmentInclude(chapters, dimension, enrichments) {
    return _.map(chapters, function (chapter) {
      var items = [];
      if (!chapter.dimensions) {
        chapter.dimensions = [];
      }
      chapter.dimensions.push({
        id: dimension.id,
        title: dimension.title,
        type: dimension.type,
        items: items
      });
      var i = 0;
      _.each(enrichments, function (e) {
        var startTime = e.start.value * 1000,
          endTime = e.end.value * 1000;

        if (i > $scope.max) {
          return chapter;
        }
        /*else if (startTime > chapter.endTime) {
         return chapter;
         }*/
        else if (startTime+2000 >= chapter.startTime && endTime-2000 <= chapter.endTime) {
          i++;
          items.push({
            "url": e.url.value
            //"source": e.source.value
          })
        }
      });
      return chapter;
    });
  }

  linkedtvSparql.getSparqlResults({query: chapterQuery(true)}, function (res) {
    var chapters = chapterMap(res.results.bindings);
    console.log('Chapters: ', chapters);

    linkedtvSparql.getSparqlResults({query: entityQuery()}, function (res) {
      chapters = chapterEntityInclude(chapters, res.results.bindings);

      linkedtvSparql.getSparqlResults({query:enrichmentQuery('Background', true)}, function (res) {
        var dimension = {id:'background',title:'Background',type:'article'};
        console.log('Background articles: ', res.results.bindings);
        chapters = chapterEnrichmentInclude(chapters, dimension, res.results.bindings);

          linkedtvSparql.getSparqlResults({query:enrichmentQuery('RelatedArtWork', true)}, function (res) {
            console.log('Arrworks: ', res.results.bindings);
            var dimension = {id: 'artwork', title: 'Related Works', type: 'europeana'};
            chapters = chapterEnrichmentInclude(chapters, dimension, res.results.bindings);

            /*linkedtvSparql.getSparqlResults({query: enrichmentQuery('Video')}, function (res) {
              console.log('Videos: ', res.results.bindings);
              var dimension = {id: 'video', title: 'Related videos', type:'video'};
              chapters = chapterEnrichmentInclude(chapters, dimension, res.results.bindings);
            */
              $http.get(Config.seed).success(function (videos) {
                var targetVideo = _(videos).find(function (v) {
                  return v.id == $scope.videoId;
                });
                targetVideo.chapters = chapters;

                Modeller.prepareTKK(targetVideo);
              });
            //});
          });
       });
    });
  });

  function debug(msg) {
    $log.debug('[Video Admin (ctrl)] ' + msg)
  }
}
