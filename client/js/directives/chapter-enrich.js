'use strict';

angular.module('app.chapter-enrich', []).directive('chapterEnrich', ['Config', 'Model', chapterEnrichDirective]);

function chapterEnrichDirective(Config, Model) {
  return {
    restrict: 'E',
    scope: {
      video: '='
    },
    replace: false,
    link: function (scope, element, attrs) {
      function setHeight() {
          var contentHeight = angular.element(".explore")[0].offsetHeight - 49-89; //header and footer
        console.log(contentHeight);
          var dimensionsHeight = scope.dimensions.length * 34; //TODO fix it: grab height of one dimension label
          angular.element('.links .scroll-view').height(contentHeight - dimensionsHeight);
          angular.element('.content .scroll-view').height(contentHeight);
        }

      //scope.dimensions = Config.dimensions;
      //scope.dimension = scope.dimensions[0].id;

      scope.$watch(
        function () {
          return Model.getChapter()
        },
        function (newChapter) {
          if (newChapter != null) {
            scope.dimensions = tempDimensions;//newChapter.dimensions;
            scope.dimension = scope.dimensions[0].id;
            setHeight();
          }
        }
      );

      scope.toggleDimension = function (active) {
        if (scope.dimension == active) {
          scope.dimension = null
        } else {
          scope.dimension = active;
        }
      };

      var tempDimensions = [
        {
          "id": "artworks",
          "title": "Related works",
          "type": "europeana",
          "items": [
            {
              "title": ["No title"],
              "thumb": ["http://europeanastatic.eu/api/image?uri=http%3A%2F%2F37.74.151.78%2Foaiserver%2Fimages%2FG0019.jpg&size=LARGE&type=IMAGE"],
              "url": [
                {
                  "value": "www.europeana.eu",
                  "uri": "http://www.europeana.eu/portal/record/2021619/G0019.html"
                }
              ],
              "about": "/proxy/provider/2021619/G0019",
              "dcCoverage": {
                "def": ["Friesland"]
              },
              "dcDate": {
                "def": ["1800", "1900"]
              },
              "proxyIn": ["/aggregation/provider/2021619/G0019"],
              "proxyFor": "/item/2021619/G0019",
              "edmType": "IMAGE",
              "year": {
                "eur": ["1800", "1900"]
              },
              "europeanaProxy": false,
              "dcDescription": {
                "def": ["Glazen flacon met een beschildering van vogels in rode verf."]
              },
              "dcIdentifier": {
                "def": ["G0019"]
              },
              "dcPublisher": {
                "def": ["Museum Martena"]
              },
              "dcSource": {
                "def": ["Museum Martena"]
              },
              "dcTitle": {
                "def": ["No title"]
              },
              "dcType": {
                "def": ["zakflacon", "fles"]
              },
              "dctermsProvenance": {
                "def": ["Museum Martena"]
              }
            },
            {
              "title": ["No title"],
              "thumb": ["http://europeanastatic.eu/api/image?uri=http%3A%2F%2F37.74.151.78%2Foaiserver%2Fimages%2FG0020.jpg&size=LARGE&type=IMAGE"],
              "url": [
                {
                  "value": "www.europeana.eu",
                  "uri": "http://www.europeana.eu/portal/record/2021619/G0020.html"
                }
              ],
              "about": "/proxy/provider/2021619/G0020",
              "dcCoverage": {
                "def": ["Friesland"]
              },
              "dcDate": {
                "def": ["1750", "1800"]
              },
              "proxyIn": ["/aggregation/provider/2021619/G0020"],
              "proxyFor": "/item/2021619/G0020",
              "edmType": "IMAGE",
              "year": {
                "eur": ["1750", "1800"]
              },
              "europeanaProxy": false,
              "dcDescription": {
                "def": ["Platte fles van blauw kobaltglas."]
              },
              "dcIdentifier": {
                "def": ["G0020"]
              },
              "dcPublisher": {
                "def": ["Museum Martena"]
              },
              "dcSource": {
                "def": ["Museum Martena"]
              },
              "dcTitle": {
                "def": ["No title"]
              },
              "dcType": {
                "def": ["flacon", "fles"]
              },
              "dctermsProvenance": {
                "def": ["Museum Martena"]
              }
            }
          ]
        },
        { "id":"background",
          "title":"Background",
          "type":"article",
          "items":[

          ]
        }
      ];

    },
    controller: function ($scope) {
      $scope.crumb = [];
      $scope.content = null;

      this.setContent = function (content, crumb, linked) {
        $scope.content = content;

        if (!linked) {
          $scope.crumb = crumb ? [crumb] : [];
        } else {
          updateCrumb(crumb);
        }
      };

      var updateCrumb = function (e) {
        var index = _($scope.crumb).pluck('value').indexOf(e.value);
        if (index != -1) {
          $scope.crumb = _($scope.crumb).first(index + 1);
        } else {
          $scope.crumb.push(e)
        }
      };

      $scope.setAbout = function (entity) {
        $scope.linkedAbout = entity;
      };
    },

    templateUrl: 'partials/directives/chapter-enrich.html'
  }
}
