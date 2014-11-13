'use strict';

angular.module('Modeler', []).factory('Modeler',
  ['europeanaApi', 'irApi', 'contentFiltering', 'documentProxy', 'entityProxy', modeler]);

function modeler(europeanaApi, irApi, contentFiltering, documentProxy, entityProxy) {

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


  var videoArtworks;
  function loadVideoArtworks(video) {
    videoArtworks = [];
    _(video.chapters).each(function (ch) {
      var meta = extractArtworksMetadata(ch);
      loadChapterArtworks(meta);
    })
  }

  function loadChapterArtworks(meta) {
    _(meta).each(function (m) {
      europeanaApi.search({query: m.value}, function (r) {
        if (r.itemsCount > 0) {
          _(r.items).each(function (i) {
            if (i.edmPreview && i.title && i.completeness > 0) {
              var splittedId = i.id.split('/');

              var artwork = {id0: splittedId[1], id1: splittedId[2], img: i.edmPreview[0], title: i.title[0]};
              fetchArtwork(artwork)
            }
          });
        }
      });
    });
  }

  function fetchArtwork(artwork) {
    europeanaApi.get({id0: artwork.id0, id1: artwork.id1}, function (r) {
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
      videoArtworks.push(content);
    });
  }


  var backgroundMetadata, backgroundMetadataSize, videoBackgrounds;
  function loadVideoBackgrounds(video) {
    videoBackgrounds = [];
    _(video.chapters).each(function (ch) {
      backgroundMetadata = extractBackgroundMetadata(ch);
      backgroundMetadataSize = backgroundMetadata.length;
      loadChapterBackground(0);
    })
  }

  function loadChapterBackground(idx) {
    if (idx < backgroundMetadataSize) {
      var meta = backgroundMetadata[idx].value;
      console.log('loading background meta: ' + meta);
      irApi.search({query: meta}, function (irResp) {
        var sources = _(irResp).keys();
        _(sources).each(function (source) {
          var posts = irResp[source];
          if (source.indexOf('$') == -1) {
            _(posts).each(function (post) {
              scrapePost(source, post);
            });
          }
        });
      });

      loadChapterBackground(idx + 1);
    }
  }

  function scrapePost(source, post) {
    var scrapingDoc = [
      {
        source: {name: source},
        url: post.mediaUrl
      }
    ];
    documentProxy.scrape(scrapingDoc, function (docResp) {
      videoBackgrounds.push({
        url: post.mediaUrl,
        title: post.micropost.title,
        post: docResp[0].text,
        source: source
      });
      //reorder backgrounds posts based on degree
      videoBackgrounds = _(videoBackgrounds).sortBy(function (b) {
        return -b.degree
      });
    });
  }


  var videoEntities;
  function loadVideoEntities(video) {
    videoEntities = [];
    _(video.chapters).each(function (ch) {
      loadChapterEntities(ch.fragments);
    })
  }

  function loadChapterEntities(entities) {
    var urls = _.chain(entities)
      .filter(function (e) {
        return e.locator;
      })
      .sortBy(function (e) {
        return e.startTime;
      })
      .map(function (e) {
        return e.locator;
      })
      .value();

    entityProxy.getList({urls: angular.toJson(urls)}, function (res) {
      _(urls).each(function (url) {
        videoEntities.push(res[url]);
      });
    });
  }

  return {
    generateNewModelFor: function (v) {
      loadVideoEntities(v);
      loadVideoArtworks(v);
      loadVideoBackgrounds(v);
    },
    printMF: function () {
      console.log(JSON.stringify(videoEntities));
      console.log(JSON.stringify(videoArtworks));
      console.log(JSON.stringify(videoBackgrounds));
    }
  };

  // model = angular.element(document.body).injector().get('Model')
  // modeler = angular.element(document.body).injector().get('Modeler')
  // modeler.generateNewModelFor(model.getVideo())
  // ... after some time ...
  // modeler.printMF()
}