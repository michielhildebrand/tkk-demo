'use strict';

angular.module('app.chapter-artworks', []).directive('chapterArtworks', ['europeanaApi', 'Model', chapterArtworksDirective]);

function chapterArtworksDirective(europeanaApi, Model) {
  return {
    restrict: 'E',
    scope: {},
    replace: false,
    require: '^chapterEnrich',
    link: function (scope, element, attrs, chapterEnrichCtrl) {
      var selectedArtwork = '';

      scope.$watch(
        function () {
          return Model.getChapter()
        },
        function (newChapter) {
          if (newChapter != null) {
            scope.artworks = [];
            loadChapterArtworks(chapterEnrichCtrl.extractArtworks(newChapter));
            selectedArtwork = '';
          }
        }
      );

      function loadChapterArtworks(meta) {
        _(meta).each(function (m) {
          europeanaApi.search({query: m.value}, function (r) {
            if (r.itemsCount > 0) {
              _(r.items).each(function (i) {
                if (i.edmPreview && i.title && i.completeness > 0) {
                  var splittedId = i.id.split('/');
                  scope.artworks.push({id0: splittedId[1], id1: splittedId[2], img: i.edmPreview[0], title: i.title[0]});
                }
              });
            }
          });
        });
      }

      scope.isSelected = function(a) {
        return a.id0 + '_' + a.id1 == selectedArtwork;
      };

      scope.nav = function(e) {
        selectedArtwork = e.id0 + '_' + e.id1;
        europeanaApi.get({id0: e.id0, id1: e.id1}, function (r) {
          var content = {
            title: [e.title], 
            thumb: [e.img],
            url: [{value: 'www.europeana.eu', uri: r.object.europeanaAggregation.edmLandingPage}]
          };
          _(r.object.proxies.reverse()).each(function(p) {
            _(content).extend(p)
          });
          chapterEnrichCtrl.setContent(content);
        });

      };
    },
    templateUrl: 'partials/directives/chapter-artworks.html'
  }
}
