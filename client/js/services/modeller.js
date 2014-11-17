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
      if(docResp.length>0) {
        return prepareArticle(post, docResp[0]);
      }
    });
  }

  function prepareArticle(e, as) {
    var article = {};
    article.title = as.title || e.micropost.title;
    article.url = as.source ? {label:as.source.name, value:e.mediaUrl} : {label: e.mediaUrl, value:e.mediaUrl};
    article.text = as.text || e.text;
    article.source = as.source ? as.source.name : "";
    article.image = as.source ? as.source.thumb : null;
    article.thd = e.thd;
    article.media = as.media;
    return article;
  }

  function fetchChapterArtworks(ch) {
    var promises = [];

    var artworksDimensions = {
      id: 'artwork',
      title: 'Related works',
      type: 'europeana',
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

    europeanaApi.search({query: q, limit:3}, function (r) {
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
      return prepareArtwork(artwork, r);
    })
  }

  function prepareArtwork(e, as) {
    var artwork = {};
    // flatten properties of all proxies to top level
    _(as.object.proxies.reverse()).each(function (p) {
      _(e).extend(p)
    });

    // must have attributes
    artwork.title = (e.dcTitle && 'def' in e.dcTitle) ? e.dcTitle.def[0] : e.title;
    artwork.url = {label: 'www.europeana.eu', value: as.object.europeanaAggregation.edmLandingPage};
    artwork.image = e.img || null;
    artwork.source = e.dcSource ? e.dcSource.def[0] :
      (e.dcPublisher ? e.dcPublisher.def[0] : "");
    artwork.description = e.dcDescription ? e.dcDescription.def[0] : "";

    // attributes dublin core
    artwork.attributes = {};
    _(e).forEach(function(value,key) {
      if (!_(['dcTitle','dcSource','dcPublisher',
          'dcDescription','dctermsProvenance','dcIdentifier']).contains(key)) {
        if(key.substring(0,2)=='dc') {
          var newKey = key.substring(2);
          artwork.attributes[newKey] = value.def;
        }
      }
    });
    return artwork;
  }


  function fetchChapterEntities(ch) {
    var promises = [];

    var aboutDimension = {
      id: 'about',
      title: 'About',
      type: 'entity',
      items: []
    };
    ch.dimensions.push(aboutDimension);

    angular.forEach(ch.fragments, function (entity) {
      var url = entity.locator;
      promises.push(
        fetchEntity(url).then(function(attrs) {
          aboutDimension.items.push(prepareEntity(entity, attrs));
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
    })
  }

  function prepareEntity(e, as) {
    var entity = _(e).clone();
    // must have attributes
    if(as.label && as.label.length>0) {
      entity.title = as.label[0].value;
    }
    entity.image = (as.thumb && as.thumb.length>0) ? as.thumb[0] : null;
    entity.description = (as.comment && as.comment.length>0) ? as.comment[0].value : "";
    entity.types = (as.type && as.type.length>0) ? as.type : [];
    entity.url = {label:'Wikipedia', value:entity.locator};

    // the remaining are attributes
    entity.attributes = {};
    _(as).forEach(function(value,key) {
      if (!_(['label','thumb', 'comment','type']).contains(key)) {
        if( (Array.isArray(value) && value.length > 0) || value != '') {
          entity.attributes[key] = cleanEntityDate(key, value);
        }
      }
    });
    return entity;
  }

  function cleanEntityDate(propName, props) {
    //TODO: we need are more generic solution to detect date
    var dateProps = ['birthDate', 'deathDate', 'activeSince'];
    if (_(dateProps).contains(propName)) {
      props = _(props).map(function(prop) {
        var i = prop.indexOf('+');
        return prop.substring(0, i);
      });
    }
    return props;
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

      if (ch.dimensions == null) ch.dimensions = [];
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
