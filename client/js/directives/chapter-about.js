'use strict';

angular.module('app.chapter-about', []).directive('chapterAbout', ['entityProxy', 'Model', chapterAboutDirective]);

function chapterAboutDirective(entityProxy, Model) {
  return {
    restrict: 'E',
    scope: {},
    replace: false,
    require: '^chapterEnrich',
    link: function (scope, element, attrs, chapterEnrichCtrl) {
      var selectedAbout = '';
      var answers = {};

      scope.$watch(
        function () {
          return Model.getChapter()
        },
        function (newChapter) {
          if (newChapter != null) {
            scope.metadata = chapterEnrichCtrl.extractMetadata(newChapter);
            scope.nav(scope.metadata[0]);
          }
        }
      );

      scope.isSelected = function(m) {
        return m.value == selectedAbout;
      };

      scope.nav = function (e) {
        selectedAbout = e.value;
        var uri = e.uri.replace('dbpedia', 'wikipedia').replace('resource', 'wiki');
        //console.log(e);
        var content = {
          title: [e.value],
          url: [{
            value: new URL(uri).hostname,
            uri: uri
          }]
        };
        if (!_(answers).has(e.value)) {
          var decodedUri = decodeURIComponent(e.uri); // hack sometimes we get encoded URIs, we don't want to double e
          entityProxy.get({loc: decodedUri}, function (r) {
            _(content).extend(_.property(decodedUri)(r));
            chapterEnrichCtrl.setContent(content, e);
            answers[e.value] = content;
          });
        } else {
          chapterEnrichCtrl.setContent(_.property(e.value)(answers), e);
        }
      };
    },
    templateUrl: 'partials/directives/chapter-about.html'
  }
}
