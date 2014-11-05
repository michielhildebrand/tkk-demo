'use strict';

angular.module('app.chapter-about', []).directive('chapterAbout', ['$log', 'entityProxy', 'Model', chapterAboutDirective]);

function chapterAboutDirective($log, entityProxy, Model) {
  return {
    restrict: 'E',
    scope: {
      linked: '='
    },
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

      scope.isSelected = function (m) {
        return m.value == selectedAbout;
      };

      scope.$watch('linked', function (e) {
        if (e != null) scope.nav(e, true);
      });

      scope.nav = function (e, linked) {
        selectedAbout = e.value;
        var uri = e.uri.replace('dbpedia', 'wikipedia').replace('resource', 'wiki');
        debug('Navigate to ' + JSON.stringify(e));
        var content = {
          title: [e.value],
          url: [
            {
              value: new URL(uri).hostname,
              uri: uri
            }
          ]
        };
        if (!_(answers).has(e.value)) {
          var decodedUri = decodeURIComponent(e.uri); // hack sometimes we get encoded URIs, we don't want to double e
          entityProxy.get({loc: decodedUri}, function (r) {
            _(content).extend(_.property(decodedUri)(r));
            chapterEnrichCtrl.setContent(content, e, linked);
            answers[e.value] = content;
          });
        } else {
          chapterEnrichCtrl.setContent(_.property(e.value)(answers), e, linked);
        }
      };

      function debug(msg) {
        $log.debug('[Chapter About] ' + msg)
      }
    },
    templateUrl: 'partials/directives/chapter-about.html'
  }
}
