'use strict';

angular.module('app.chapter-background', []).directive('chapterBackground',
  ['$log', 'irApi', 'contentFiltering', 'documentProxy', 'Model', chapterBackgroundDirective]);

function chapterBackgroundDirective($log, irApi, contentFiltering, documentProxy, Model) {
  return {
    restrict: 'E',
    scope: {},
    replace: false,
    require: '^chapterEnrich',
    link: function (scope, element, attrs, chapterEnrichCtrl) {
      var metadata = [];
      var metadataSize = 0;
      var selectedBackground = '';

      scope.$watch(
        function () {
          return Model.getChapter()
        },
        function (newChapter) {
          if (newChapter != null) {
            metadata = chapterEnrichCtrl.extractBackground(newChapter);
            metadataSize = metadata.length;
            scope.backgrounds = [];
            loadChapterBackground(0);
            selectedBackground = '';
          }
        }
      );

      function loadChapterBackground(idx) {
        if (idx < metadataSize) {
          var meta = metadata[idx].value;

          debug('Making IRAPI request');
          irApi.search({query: meta}, function (irResp) {
            var sources = _(irResp).keys();
            debug('IRAPI response, sources: ' + sources.length);

            debug('Making personalization request');
            contentFiltering.personalize(irResp, function (cfResp) {
              var personalizedPosts = cfResp.results;
              debug('Personalization response, posts: ' + personalizedPosts.length);

              _(sources).each(function (source) {
                var posts = irResp[source];

                if (source.indexOf('$') == -1) {
                  _(posts).each(function (post, index) {
                    var degree = 0;
                    var personalizedPost = personalizedPosts[index];
                    if (personalizedPost) degree = personalizedPost.Degree;
                    scrapePost(source, post, degree);
                  });
                }
              });

              loadChapterBackground(idx + 1);
            })
          })
        } else {
          //reorder backgrounds posts based on degree
          _(scope.backgrounds).sortBy(function (b) {
            return -b.degree
          })
        }
      }

      function scrapePost(source, post, degree) {
        var scrapingDoc = [
          {
            source: {name: source},
            url: post.mediaUrl
          }
        ];
        debug('Scraping doc: ' + JSON.stringify(scrapingDoc));
        documentProxy.scrape(scrapingDoc, function (docResp) {
          scope.backgrounds.push({
            url: post.mediaUrl,
            title: post.micropost.title,
            post: docResp[0].text,
            source: source,
            degree: degree
          })
        });
      }

      scope.isSelected = function (b) {
        return b.url == selectedBackground;
      };

      scope.nav = function (e) {
        selectedBackground = e.url;
        debug('Navigate to ' + JSON.stringify(e));
        var content = {
          title: [e.title],
          url: [
            {value: e.source, uri: e.url}
          ],
          comment: [e.post]
        };
        chapterEnrichCtrl.setContent(content);
      };

      function debug(msg) {
        $log.debug('[Chapter Background (directive)] ' + msg)
      }
    },
    templateUrl: 'partials/directives/chapter-background.html'
  }
}
