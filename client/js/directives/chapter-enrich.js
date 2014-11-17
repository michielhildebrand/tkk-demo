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
          "id": "about",
          "title": "About",
          "type": "entity",
          "items": [
              {
                "locator": "http://nl.dbpedia.org/resource/Napoleon_III",
                "duration": "5522398",
                "title": "Napoleon III",
                "startTime": 2758399,
                "attributes": {
                  "type": ["person", "politician", "resource"],
                  "birthDate": ["1808-04-20+02:00", "1808-04-20"],
                  "birthPlace": [
                    {
                      "uri": "http://dbpedia.org/resource/First_French_Empire",
                      "lang": "nl",
                      "value": "Eerste Franse Keizerrijk"
                    },
                    {
                      "uri": "http://de.dbpedia.org/resource/Paris",
                      "lang": "",
                      "value": "Paris"
                    }
                  ],
                  "comment": [
                    {
                      "lang": "nl",
                      "value": "Karel Lodewijk Napoleon Bonaparte (Frans: Charles-Louis-Napoléon Bonaparte; Parijs, 20 april 1808 - Chislehurst bij Londen, 9 januari 1873) was president van Frankrijk van 1848 tot 1852, en als Napoleon III keizer van Frankrijk van 1852 tot 1870. Lodewijk Napoleon was een neef (oomzegger) van Napoleon I."
                    }
                  ],
                  "deathDate": ["1873-01-09+02:00", "1873-01-09"],
                  "deathPlace": [
                    {
                      "uri": "http://dbpedia.org/resource/Chislehurst",
                      "lang": "nl",
                      "value": "Chislehurst"
                    }
                  ],
                  "label": [
                    {
                      "lang": "nl",
                      "value": "Napoleon III"
                    }
                  ],
                  "nationality": [],
                  "office": ["Co-vorst van Andorra", "Keizer der Fransen", "President van Frankrijk"],
                  "officeholderAfter": [
                    {
                      "uri": "http://dbpedia.org/resource/Louis_Jules_Trochu",
                      "lang": "",
                      "value": "Louis_Jules_Trochu"
                    },
                    {
                      "uri": "http://dbpedia.org/resource/Napol%C3%A9on,_Prince_Imperial",
                      "lang": "",
                      "value": "Napol%C3%A9on,_Prince_Imperial"
                    }
                  ],
                  "officeholderBefore": [
                    {
                      "uri": "http://dbpedia.org/resource/Louis-Eug%C3%A8ne_Cavaignac",
                      "lang": "",
                      "value": "Louis-Eug%C3%A8ne_Cavaignac"
                    },
                    {
                      "uri": "http://dbpedia.org/resource/Louis_Bonaparte",
                      "lang": "",
                      "value": "Louis_Bonaparte"
                    },
                    {
                      "uri": "http://dbpedia.org/resource/Louis_Philippe_I",
                      "lang": "",
                      "value": "Louis_Philippe_I"
                    }
                  ],
                  "party": [],
                  "predecessor": [
                    {
                      "uri": "http://nl.dbpedia.org/resource/Tweede_Franse_Republiek",
                      "lang": "nl",
                      "value": "République française"
                    },
                    {
                      "uri": "http://nl.dbpedia.org/resource/Lodewijk_Filips_I_van_Frankrijk",
                      "lang": "",
                      "value": "Lodewijk_Filips_I_van_Frankrijk"
                    },
                    {
                      "uri": "http://fr.dbpedia.org/resource/Louis_Eugène_Cavaignac",
                      "lang": "",
                      "value": "Louis_Eugène_Cavaignac"
                    },
                    {
                      "uri": "http://fr.dbpedia.org/resource/Louis-Philippe_Ier",
                      "lang": "",
                      "value": "Louis-Philippe_Ier"
                    },
                    {
                      "uri": "http://fr.dbpedia.org/resource/Louis_Bonaparte",
                      "lang": "",
                      "value": "Louis_Bonaparte"
                    }
                  ],
                  "profession": [],
                  "successor": [
                    {
                      "uri": "http://nl.dbpedia.org/resource/Derde_Franse_Republiek",
                      "lang": "nl",
                      "value": "République française"
                    },
                    {
                      "uri": "http://nl.dbpedia.org/resource/Adolphe_Thiers",
                      "lang": "",
                      "value": "Adolphe_Thiers"
                    },
                    {
                      "uri": "http://nl.dbpedia.org/resource/Tweede_Franse_Keizerrijk",
                      "lang": "",
                      "value": "Tweede_Franse_Keizerrijk"
                    },
                    {
                      "uri": "http://fr.dbpedia.org/resource/Louis_Napoléon_Bonaparte_(Prince_impérial)",
                      "lang": "",
                      "value": "Louis_Napoléon_Bonaparte_(Prince_impérial)"
                    },
                    {
                      "uri": "http://fr.dbpedia.org/resource/Louis_Jules_Trochu",
                      "lang": "",
                      "value": "Louis_Jules_Trochu"
                    },
                    {
                      "uri": "http://fr.dbpedia.org/resource/Adolphe_Thiers",
                      "lang": "",
                      "value": "Adolphe_Thiers"
                    }
                  ],
                  "thumb": ["http://commons.wikimedia.org/wiki/Special:FilePath/Alexandre_Cabanel_002.jpg", "http://upload.wikimedia.org/wikipedia/commons/9/99/Franz_Xaver_Winterhalter_Napoleon_III.jpg"]
                }
              },
              {
                "locator": "http://nl.dbpedia.org/resource/Marie_Antoinette_van_Oostenrijk",
                "duration": "5532719",
                "title": "Marie Antoinette",
                "startTime": 2764199,
                "attributes": {
                  "type": ["person", "resource"],
                  "birthDate": ["1755-11-02Z", "1755-11-02+02:00"],
                  "birthPlace": [
                    {
                      "uri": "http://dbpedia.imp.fu-berlin.de:49156/resource/Wien",
                      "lang": "",
                      "value": "Wien"
                    },
                    {
                      "uri": "http://dbpedia.org/resource/Archduchy_of_Austria",
                      "lang": "",
                      "value": "Archduchy_of_Austria"
                    },
                    {
                      "uri": "http://dbpedia.org/resource/Hofburg_Palace",
                      "lang": "",
                      "value": "Hofburg_Palace"
                    },
                    {
                      "uri": "http://dbpedia.org/resource/Vienna",
                      "lang": "",
                      "value": "Vienna"
                    }
                  ],
                  "comment": [
                    {
                      "lang": "nl",
                      "value": "Maria Antonia Josepha Johanna (Wenen, 2 november 1755 - Parijs, 16 oktober 1793), beter bekend als Marie Antoinette, was de echtgenote van koning Lodewijk XVI van Frankrijk, en dus koningin van Frankrijk."
                    }
                  ],
                  "deathDate": ["1793-10-16Z", "1793-10-16+02:00"],
                  "deathPlace": [
                    {
                      "uri": "http://dbpedia.imp.fu-berlin.de:49156/resource/Paris",
                      "lang": "",
                      "value": "Paris"
                    },
                    {
                      "uri": "http://dbpedia.org/resource/Paris",
                      "lang": "nl",
                      "value": "Parijs"
                    },
                    {
                      "uri": "http://dbpedia.org/resource/French_First_Republic",
                      "lang": "",
                      "value": "French_First_Republic"
                    },
                    {
                      "uri": "http://dbpedia.org/resource/Place_de_la_Concorde",
                      "lang": "",
                      "value": "Place_de_la_Concorde"
                    }
                  ],
                  "label": [
                    {
                      "lang": "nl",
                      "value": "Marie Antoinette van Oostenrijk"
                    }
                  ],
                  "nationality": [],
                  "predecessor": [
                    {
                      "uri": "http://nl.dbpedia.org/resource/Maria_Leszczyńska",
                      "lang": "nl",
                      "value": "Maria Leszczyńska"
                    }
                  ],
                  "profession": [],
                  "successor": [
                    {
                      "uri": "http://nl.dbpedia.org/resource/1804",
                      "lang": "",
                      "value": "1804"
                    },
                    {
                      "uri": "http://nl.dbpedia.org/resource/Joséphine_de_Beauharnais",
                      "lang": "",
                      "value": "Joséphine_de_Beauharnais"
                    }
                  ],
                  "thumb": ["http://commons.wikimedia.org/wiki/Special:FilePath/Louise_Elisabeth_Vigée-Lebrun_-_Marie-Antoinette_dit_«_à_la_Rose_»_-_Google_Art_Project.jpg", "http://commons.wikimedia.org/wiki/Special:FilePath/Marie-Antoinette_par_Elisabeth_Vigée-Lebrun_-_1783.jpg", "http://upload.wikimedia.org/wikipedia/commons/3/3b/Marie_Antoinette_Adult4.jpg"]
                }
              }
          ]

        },
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
