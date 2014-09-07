'use strict';

angular.module('app.chapter-artworks', []).directive('chapterArtworks', ['europeanaApi', chapterArtworksDirective]);

function chapterArtworksDirective(europeanaApi) {
  return {
    restrict: 'E',
    scope: {
      'metadata': '='
    },
    replace: false,
    require: '^chapterEnrich',
    link: function (scope, element, attrs, chapterEnrichCtrl) {
      scope.loading = false;

      scope.$watch('metadata', function (newMetadata) {
        if (newMetadata != null) {
          scope.artworks = [];
          loadChapterArtworks(newMetadata);
        }
      });

      function loadChapterArtworks(meta) {
        var metadataSize = meta.length;

        scope.loading = true;
        _(meta).each(function (m, index) {
          europeanaApi.search({query: m.value}, function (r) {
            if (r.itemsCount > 0) {
              _(r.items).each(function (i) {
                if (i.edmPreview && i.title) {
                  var splittedId = i.id.split('/');
                  scope.artworks.push({id0: splittedId[1], id1: splittedId[2], img: i.edmPreview[0], title: i.title[0]});
                }
              });
            }

            if (index == metadataSize - 1) {
              scope.loading = false;
            }
          });
        });
      }

      scope.nav = function(e) {
        europeanaApi.get({id0: e.id0, id1: e.id1}, function (r) {
          //console.log('Europeana record', r);
          var content = {};
          _(r.object.proxies.reverse()).each(function(p) {
            _(content).extend(p)
          });
          _(content).extend({label: [e.title], thumb: [e.img]});
          chapterEnrichCtrl.setContent(content);
        });

      };
    },
    templateUrl: 'partials/directives/chapter-artworks.html'
  }
}
