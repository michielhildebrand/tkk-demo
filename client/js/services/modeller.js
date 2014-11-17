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
    console.log('articles metadata ' + meta + ' for ' + ch.title);
    angular.forEach(meta, function (m) {
      promises.push(searchPosts(m.value, backgroundDimensions.items));
    });

    return $q.all(promises);
  }

  function searchPosts(q, dimension) {
    var deferred = $q.defer();

    irApi.search({query: q, limit: 3}, function (irResp) {
      var sources = _(_(irResp).keys()).filter(function(s) {return s.indexOf('$') == -1});
      var posts = _.chain(sources)
        .map(function(s) {
          return _(irResp[s]).map(function(p) {return {source: s, post: p}})
        })
        .flatten()
        .value();
      var count = posts.length;
      console.log(count + ' articles for query ' + q);
      angular.forEach(posts, function (p, postIdx) {
        scrapePost(p.source, p.post).then(function(article) {
          // if the promise is resolved with null we skip adding to the dimension
          if (article) dimension.push(article);
          if (postIdx == count - 1) {
            console.log('last article of ' + count + ' for query ' + q);
            deferred.resolve(true);
          }
        });
      });
    });

    return deferred.promise;
  }

  var postsCount = 0;
  function scrapePost(source, post) {
    var scrapingDoc = [
      {
        source: {name: source},
        url: post.mediaUrl
      }
    ];
    return documentProxy.scrape(scrapingDoc).$promise.then(function (docResp) {
      console.log('scraped post ' + ++postsCount);
      if (docResp[0]) {
        return ({
          source: source,
          title: post.micropost.title,
          url: post.mediaUrl,
          post: docResp[0].text,
          thd: post.thd
        });
      } else {
        return null;
      }
    }).catch(angular.noop);
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
    angular.forEach(meta, function (m) {
      promises.push(searchArtworks(m.value, artworksDimensions.items));
    });

    return $q.all(promises);
  }

  function searchArtworks(q, dimension) {
    var deferred = $q.defer();

    europeanaApi.search({query: q}, function (r) {
      if (r.itemsCount > 0) {
        console.log(r.itemsCount + ' artworks for query ' + q);
        angular.forEach(r.items, function (item, itemIdx) {
          validateFetchArtwork(item).then(function (artwork) {
            // if the promise is resolved with null we skip adding to the dimension
            if (artwork) dimension.push(artwork);
            if (itemIdx == r.itemsCount - 1) {
              console.log('last artwork of ' + r.itemsCount + ' for query ' + q);
              deferred.resolve(true);
            }
          })
        });
      }
    });

    return deferred.promise;
  }

  function validateFetchArtwork(item) {
    if (item.edmPreview && item.title && item.completeness > 0) {
      var splittedId = item.id.split('/');
      var artwork = {id0: splittedId[1], id1: splittedId[2], img: item.edmPreview[0], title: item.title[0]};
      return fetchArtwork(artwork);
    } else {
      // if we skip one artwork we still have to return back a promise that will be resolved with null
      var d = $q.defer();
      d.resolve(null);
      return d.promise;
    }
  }

  var artworksCount = 0;
  function fetchArtwork(artwork) {
    return europeanaApi.get({id0: artwork.id0, id1: artwork.id1}).$promise.then(function (r) {
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
    }).catch(angular.noop);
  }


  function fetchChapterEntities(ch) {
    var promises = [];

    angular.forEach(ch.fragments, function (entity) {
      var url = entity.locator;
      promises.push(
        fetchEntity(url).then(function(attrs) {
          entity.attributes = attrs;
        })
      )
    });

    return $q.all(promises);
  }

  var entitiesCount = 0;
  function fetchEntity(url) {
    return entityProxy.getList({urls: angular.toJson([url])}).$promise.then(function (res) {
      console.log('got entity ' + ++entitiesCount);
      return res[url];
    }).catch(angular.noop);
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

    angular.forEach(v.chapters, function (ch) {
      console.log('Enriching chapter ' + ch.title);

      //if (ch.dimensions == null) ch.dimensions = [];

      promises.push(fetchChapterEntities(ch));
      promises.push(fetchChapterArtworks(ch));
      promises.push(fetchChapterBackground(ch));
    });

    console.log(promises);
    $q.all(promises).then(
      function () {
        console.log("Video enriching done.");
        console.log(v);
        saveJsonFile(v);
      },
      function (errors) {
        console.log("We've got some errors while enriching");
      }
    )
  }

  return {
    enrich: function (v) {
      //takes the current video that the user is watching and enriches it
      enrichVideo(v);
    }
  };

  // run from the console:
  // angular.element(document.body).injector().get('Modeller').enrich()
}
