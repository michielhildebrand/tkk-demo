'use strict';

angular.module('Modeller', []).factory('Modeller',
  ['$q', '$timeout', 'Model', 'europeanaApi', 'irApi', 'documentProxy', 'entityProxy', modeler]);

function modeler($q, $timeout, Model, europeanaApi, irApi, documentProxy, entityProxy) {

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
    console.log('Fetching backgrounds for ' + ch.title);
    var promises = [];

    var meta = extractBackgroundMetadata(ch);
    _(meta).each(function (m) {
      irApi.search({query: m.value}, function (irResp) {
        var sources = _(irResp).keys();
        _(sources).each(function (source) {
          var posts = irResp[source];
          if (source.indexOf('$') == -1) {
            _(posts).each(function (post) {
              promises.push(scrapePost(source, post, ch));
            });
          }
        });
      });
    });

    return $q.all(promises);
  }

  var postsCount = 0;
  function scrapePost(source, post, ch) {
    var scrapingDoc = [
      {
        source: {name: source},
        url: post.mediaUrl
      }
    ];
    return documentProxy.scrape(scrapingDoc, function (docResp) {
      console.log('scraped post ' + ++postsCount);
      if (docResp[0]) {
        ch.dimensions.backgrounds.push({
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
    console.log('Fetching artworks for ' + ch.title);
    var promises = [];

    var meta = extractArtworksMetadata(ch);
    _(meta).each(function (m) {
      europeanaApi.search({query: m.value}, function (r) {
        if (r.itemsCount > 0) {
          _(r.items).each(function (item) {
            if (item.edmPreview && item.title && item.completeness > 0) {
              var splittedId = item.id.split('/');
              var artwork = {id0: splittedId[1], id1: splittedId[2], img: item.edmPreview[0], title: item.title[0]};
              promises.push(fetchArtwork(artwork, ch))
            }
          });
        }
      })
    });

    return $q.all(promises);
  }

  var artworksCount = 0;
  function fetchArtwork(artwork, ch) {
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
      ch.dimensions.artworks.push(content);
    });
  }

  var entitiesCount = 0;
  function fetchChapterEntities(ch) {
    console.log('Fetching entities for ' + ch.title);
    var promises = [];

    _(ch.fragments).each(function (entity) {
      var url = entity.locator;
      promises.push(
        entityProxy.getList({urls: angular.toJson([url])}, function (res) {
          console.log('got entity ' + ++entitiesCount);
          entity = _(entity).extend(res[url]);
        })
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
      // prepares dimensions
      ch.dimensions = {
        artworks: [],
        backgrounds: []
      };
      promises.push(fetchChapterEntities(ch));
      promises.push(fetchChapterArtworks(ch));
      promises.push(fetchChapterBackground(ch));
    });

    $timeout(function () {
      console.log(promises);
      $q.all(promises).then(
        function () {
          console.log("Video enriching done.");
          console.log(v);
          //console.log(JSON.stringify(v));
          //saveJsonFile(v);
        },
        function (errors) {
          console.log("We've got some errors while enriching");
        }
      )
    }, 10000)
  }

  return {
    enrich: function () {
      //takes the current video that the user is watching and enriches it
      enrichVideo(Model.getVideo());
    },
    save: function() {
      saveJsonFile(Model.getVideo());
    }
  };

  // from the console
  // angular.element(document.body).injector().get('Modeller').enrich()
}
