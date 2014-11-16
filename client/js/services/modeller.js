'use strict';

angular.module('Modeller', []).factory('Modeller',
  ['$q', 'Model', 'europeanaApi', 'irApi', 'documentProxy', 'entityProxy', modeler]);

function modeler($q, Model, europeanaApi, irApi, documentProxy, entityProxy) {

  function extractMetadata(ch) {
    return _.chain(ch.fragments)
      .map(function (f) {
        return {value: f.title.trim()}
      })
      .filter(function (m) {
        return m.value.length > 0
      })
      .uniq(false, function (m) {
        return m.value;
      })
      .sortBy(function (m) {
        return m.value.toLowerCase();
      })
      .value();
  }

  function extractArtworksMetadata(ch) {
    if (ch.artworks != null) {
      return _(ch.artworks).map(function (a) {
        return {value: a}
      });
    } else {
      return extractMetadata(ch);
    }
  }

  function extractBackgroundMetadata(ch) {
    if (ch.backgrounds != null) {
      return _(ch.backgrounds).map(function (a) {
        return {value: a}
      });
    } else {
      return extractMetadata(ch);
    }
  }


  function fetchChapterBackground(ch) {
    var promises = [];

    var backgroundDimensions = {
      id: 'background',
      title: 'Background',
      type: 'article',
      items: []
    };
    ch.dimensions.push(backgroundDimensions);

    var meta = extractBackgroundMetadata(ch);
    _(meta).each(function (m) {
      irApi.search({query: m.value}, function (irResp) {
        _(_(irResp).keys()).each(function (source) {
          if (source.indexOf('$') == -1) {
            _(irResp[source]).each(function (post) {
              promises.push(scrapePost(source, post, backgroundDimensions.items));
            });
          }
        });
      });
    });

    return $q.all(promises);
  }

  var postsCount = 0;

  function scrapePost(source, post, dimension) {
    var scrapingDoc = [
      {
        source: {name: source},
        url: post.mediaUrl
      }
    ];
    return documentProxy.scrape(scrapingDoc, function (docResp) {
      console.log('scraped post ' + ++postsCount);
      if (docResp[0]) {
        dimension.push({
          source: source,
          title: post.micropost.title,
          url: post.mediaUrl,
          post: docResp[0].text,
          thd: post.thd
        });
      }
    });
  }


  function fetchChapterArtworks(ch) {
    var promises = [];

    var artworksDimensions = {
      id: 'artwork',
      title: 'Artwork',
      type: 'image',
      items: []
    };
    ch.dimensions.push(artworksDimensions);

    var meta = extractArtworksMetadata(ch);
    console.log('artworks metadata ' + meta + ' for ' + ch.title);
    _(meta).each(function (m) {
      promises.push(searchArtworks(m.value, artworksDimensions.items));
    });

    return $q.all(promises);
  }

  function searchArtworks(q, dimension) {
    var deferred = $q.defer();

    europeanaApi.search({query: q}, function (r) {
      if (r.itemsCount > 0) {
        console.log(r.itemsCount + ' artworks for query ' + q);
        _(r.items).each(function (item, itemIdx) {
          prepareFetchArtwork(item, dimension, deferred, itemIdx, r.itemsCount, q)
        });
      }
    });

    return deferred.promise;
  }

  function prepareFetchArtwork(item, dimension, deferred, itemIdx, count, q) {
    if (item.edmPreview && item.title && item.completeness > 0) {
      var splittedId = item.id.split('/');
      var artwork = {id0: splittedId[1], id1: splittedId[2], img: item.edmPreview[0], title: item.title[0]};
      fetchArtwork(artwork).then(function (res) {
        dimension.push(res.object);
        if (itemIdx == count - 1) {
          console.log('last artwork of ' + count + ' for query ' + q);
          deferred.resolve(true);
        }
      })
    }
  }

  var artworksCount = 0;
  function fetchArtwork(artwork) {
    return europeanaApi.get({id0: artwork.id0, id1: artwork.id1}, function (r) {
      console.log('got artwork ' + ++artworksCount);
      var content = {
        title: [artwork.title],
        thumb: [artwork.img],
        url: [
          {value: 'www.europeana.eu', uri: r.object.europeanaAggregation.edmLandingPage}
        ]
      };
      _(r.object.proxies.reverse()).each(function (p) {
        _(content).extend(p)
      });
      return content;
    }).$promise
  }

  var entitiesCount = 0;
  function fetchChapterEntities(ch) {
    var promises = [];

    _(ch.fragments).each(function (entity) {
      var url = entity.locator;
      promises.push(
        entityProxy.getList({urls: angular.toJson([url])}, function (res) {
          console.log('got entity ' + ++entitiesCount);
          entity = _(entity).extend({attributes: res[url]});
        }).$promise
      )
    });

    return $q.all(promises);
  }

  function saveJsonFile(v) {
    var blob = new Blob([JSON.stringify(v)], {type: "application/json"});
    var url = window.URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.download = v.id + ".json";
    a.href = url;
    a.click();
  }

  function enrichVideo(v) {
    var promises = [];

    _(v.chapters).each(function (ch) {
      console.log('Enriching chapter ' + ch.title);
      ch.dimensions = [];
      promises.push(fetchChapterEntities(ch));
      promises.push(fetchChapterArtworks(ch));
      promises.push(fetchChapterBackground(ch));
    });

    console.log(promises);
    $q.all(promises).then(
      function () {
        console.log("Video enriching done.");
        console.log(v);
        //console.log(JSON.stringify(v));
      },
      function (errors) {
        console.log("We've got some errors while enriching");
      }
    )
  }

  return {
    enrich: function () {
      //takes the current video that the user is watching and enriches it
      enrichVideo(Model.getVideo());
    },
    save: function () {
      saveJsonFile(Model.getVideo());
    }
  };

  // run from the console:
  // angular.element(document.body).injector().get('Modeller').enrich()
}
