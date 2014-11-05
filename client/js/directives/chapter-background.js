'use strict';

angular.module('app.chapter-background', []).directive('chapterBackground', ['$log', 'irApi', 'contentFiltering', 'Model', chapterBackgroundDirective]);

function chapterBackgroundDirective($log, irApi, contentFiltering, Model) {
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
          irApi.search({query: meta}, function (r) {
            var sources = _(r).keys();
            _(sources).each(function(source) {
              if (source.indexOf('$') == -1) {
                _(r[source]).each(function(post) {
                  // Once the personalization service is working we can send the IRApi response to it
                  // and receive a ranking property for each post and we can re-order the posts based on it
                  //contentFiltering.personalize(post)

                  scope.backgrounds.push({title: post.micropost.title, url: post.mediaUrl, post: post.micropost, source: source})
                });
              }
            });

            loadChapterBackground(idx + 1);
          })
        }
      }

      scope.isSelected = function(b) {
        return b.url == selectedBackground;
      };

      scope.nav = function(e) {
        selectedBackground = e.url;
        debug('Navigate to ' + JSON.stringify(e));
        var content = {
          title: [e.title], 
          url: [{value: e.source, uri: e.url}],
          comment: [e.post.html]
        };
        chapterEnrichCtrl.setContent(content);
      };

      function debug(msg) {
        $log.debug('[Chapter Background] ' + msg)
      }
    },
    templateUrl: 'partials/directives/chapter-background.html'
  }
}
