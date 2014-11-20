'use strict';

angular.module('Modeller', []).factory('Modeller',
  ['$q', 'Model', 'europeanaApi', 'irApi', 'documentProxy', 'entityProxy', 'editorTool', modeler]);

function modeler($q, Model, europeanaApi, irApi, documentProxy, entityProxy, editorTool) {

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

    irApi.search({query: q, limit: 1}, function (irResp) {
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
    }).catch(angular.noop);
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
    }).catch(angular.noop);
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
    artwork.image = as.object.europeanaAggregation.edmPreview || null;
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
    console.log(artwork);
    return artwork;
  }

  function fetchChapterFragments(ch) {
    var promises = [];

    angular.forEach(ch.fragments, function (entity) {
      var url = entity.locator;
      promises.push(
        fetchEntity(url).then(function(attrs) {
          if(attrs&&attrs.label) {
            prepareEntity(entity, attrs);
          }
        })
      )
    });

    return $q.all(promises);
  }

  var entitiesCount = 0;
  function fetchEntity(url) {
    return entityProxy.get({url: url, lang:'de'}).$promise.then(function (res) {
      console.log('got entity ' + ++entitiesCount);
      return res[url];
    }).catch(angular.noop);
  }

  function prepareEntity(entity, as) {
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
        if( Array.isArray(value) && value.length>0) {
          value = _(value).filter(function(v) {
            return v !== "" && v !== null;
          });
          if(value.length > 0) {
            entity.attributes[key] = _(cleanEntityDate(key, value)).uniq();
          }
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
        if(i>0) {
           prop = prop.substring(0, i);
        }
        var i = prop.indexOf('T');
        if(i>0) {
          prop = prop.substring(0, i);
        }
        return prop
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

      //promises.push(fetchChapterFragments(ch));
      promises.push(fetchChapterAbout(ch));
      //promises.push(fetchChapterArtworks(ch));
      //promises.push(fetchChapterBackground(ch));
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

  function prepareTKKVideo(v) {
    var promises = [];

    editorTool.get({id: v.id}, function(curatedData) {
      console.log('curated data ', curatedData);

      angular.forEach(v.chapters, function (ch, i) {

        var aboutDimension = {
          id: 'about',
          title: 'About',
          type: 'entity',
          items: []
        };
        ch.dimensions.unshift(aboutDimension);

        var curatedChapter = curatedData.chapters[i];
        console.log('curated chapter', curatedChapter);
        if(curatedChapter.dimensions.maintopic) {
          _(curatedChapter.dimensions.maintopic.annotations).each(function(card) {
            var entity = prepareCard(card);
            console.log('artwork', entity);
            aboutDimension.items.push(entity);
          })

        }

        var background = _(ch.dimensions).find(function(d) {
          return d.id == "background";
        });
        if(background) {
          promises.push(prepareDocuments(background.items));
        }

        var artworks = _(ch.dimensions).find(function(d) {
          return d.id == "artwork";
        });
        if(artworks) {
          promises.push(prepareArtworks(artworks.items));
        }
      });

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

    });
  }

  function prepareDocuments(items) {
    var promises = [];

    angular.forEach(items, function (item) {
      promises.push(
        fetchDocument(item).then(function(attrs) {
          if(attrs) {
            prepareDocument(item, attrs);
          }
        })
      )
    });

    return $q.all(promises);
  }

  var documentCount = 0;
  function fetchDocument(item) {
    var source = new URL(item.url).hostname;
    return documentProxy.scrape({url:item.url}).$promise.then(function (res) {
      console.log('got document ' + ++documentCount);
      return res;
    }).catch(angular.noop);
  }

  function prepareDocument(item, as) {
    var source = new URL(item.url).hostname;

    console.log(item, as);
    item.title = as.title;
    item.url = item.url;
    item.html = as.text;
    item.author = as.author;
    item.summary = as.summary;
    item.source = source;
    //article.thd = e.thd;
    item.media = as.media;
    return item;
  }

  function prepareArtworks(items) {
    var promises = [];

    angular.forEach(items, function (item) {
      console.log('artwork ', item.url);
      var pathname = new URL(item.url).pathname;
      console.log(pathname);
      if( pathname && pathname.substr(0,15) == '/portal/record/' ) {
        var splittedId = pathname.split('/');
        console.log(splittedId);
        var id0 = splittedId[3];
        var id1 = splittedId[4].split('.')[0];
        var artwork = {id0: id0, id1: id1};
        promises.push(
          fetchEuropeana(artwork).then(function (attrs) {
            if(attrs) {
              prepareEuropeana(item, attrs);
            }
          })
        )
      }
    });

    return $q.all(promises);
  }

  function fetchEuropeana(artwork) {
    return europeanaApi.get({id0: artwork.id0, id1: artwork.id1}).$promise.then(function (r) {
      console.log('got artwork ' + ++artworksCount);
      return r;
    }).catch(angular.noop);
  }

  function prepareEuropeana(artwork, as) {
    var e = {};
    // flatten properties of all proxies to top level
    _(as.object.proxies.reverse()).each(function (p) {
      _(e).extend(p)
    });

    // must have attributes
    artwork.title = (e.dcTitle && 'def' in e.dcTitle) ? e.dcTitle.def[0] : e.title;
    artwork.url = {label: 'www.europeana.eu', value: as.object.europeanaAggregation.edmLandingPage};
    artwork.image = as.object.europeanaAggregation.edmPreview || null;
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
    console.log(artwork);
    return artwork;
  }


  function prepareAbout(ch, items) {
    var promises = [];

    angular.forEach(ch.fragments, function (entity) {
      var url = entity.locator;
      promises.push(
        fetchEntity(url).then(function(attrs) {
          if(attrs&&attrs.label) {
            var newEntity = _(entity).clone();
            items.push(prepareEntity(newEntity, attrs));
          }
        })
      )
    });

    return $q.all(promises);
  }

  function prepareCard(as) {
    var entity = {};
    entity.title = as.label;
    entity.image = as.poster || as.thumb;
    entity.description = as.comment;
    if(as.type) {
      entity.types = as.type;
    }
    entity.attributes = {};
    _(as.template.properties).each(function(o) {
      if(o.value && !_(['label','thumb', 'comment','type']).contains(o.key)) {
        if(o.value.uri) {
          entity.attributes[o.key] = [{uri: o.value.uri, value: o.value.label}];
        } else {
          entity.attributes[o.key] = [o.value]
        }

      }
    });
    return entity;
  }


  return {
    enrich: function (v) {
      //takes the current video that the user is watching and enriches it
      enrichVideo(v);
    },
    prepareTKK: function(v) {
      prepareTKKVideo(v);
    }
  };

  // run from the console:
  // angular.element(document.body).injector().get('Modeller').enrich()
}
