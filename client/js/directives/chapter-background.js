'use strict';

angular.module('app.chapter-background', []).directive('chapterBackground', ['irApi', 'Model', chapterBackgroundDirective]);

function chapterBackgroundDirective(irApi, Model) {
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
                  //console.log(post);
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
        //console.log(e);
        var content = {
          title: [e.title], 
          url: [{value: e.source, uri: e.url}],
          comment: [e.post.html]
        };
        chapterEnrichCtrl.setContent(content);
      };

    },
    templateUrl: 'partials/directives/chapter-background.html'
  }
}
