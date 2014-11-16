'use strict';

angular.module('app.entity-slider', []).directive('entitySlider', ['$log', 'entityProxy', 'Model', '$ionicSlideBoxDelegate', entitySliderDirective]);

function entitySliderDirective($log, entityProxy, Model, $ionicSlideBoxDelegate) {
  return {
    restrict: 'E',
    scope: {},
    replace: false,
    link: function (scope, element, attrs) {
      scope.currentEntityIndex = 0;

      scope.$watch(
        function () {
          return Model.getChapter()
        },
        function (newChapter) {
          if (newChapter != null && newChapter.fragments != null) {
            setEntityContent(newChapter.fragments);
          }
        }
      );

      scope.$watch(
        function () {
          return Model.getFragment()
        },
        function (newFragment) {
          if (newFragment != null) {
            debug('Automatically slide to entity index: ' + newFragment.index);
            scope.currentEntityIndex = newFragment.index;
          }
        }
      );

      function setEntityContent(entities) {
        /*var urls = _.chain(entities)
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
          scope.entities = [];
          _(urls).each(function(url) {
            scope.entities.push(res[url]);
          });
          debug('Loaded ' + scope.entities.length + ' entities.');
          $ionicSlideBoxDelegate.update();
        });*/

        scope.entities = tempEntities;
        debug('Loaded ' + scope.entities.length + ' entities.');
        $ionicSlideBoxDelegate.update();
      }

      scope.selectEntity = function(entityIndex) {
        scope.currentEntityIndex = entityIndex;
      };

      function debug(msg) {
        $log.debug('[Entity Slider (directive)] ' + msg)
      }


      var tempEntities = [
        {
          "locator": "http://nl.dbpedia.org/resource/Nelleke_van_der_Krogt",
          "duration": "99000",
          "title": "Nelleke van der Krogt",
          "startTime": 44000,
          "index": 0,
          "type": ["person", "presenter", "resource"],
          "activeSince": ["1988-01-01T00:00:00+02:00", "1988-01-01T00:00:00+01:00"],
          "birthDate": ["1948-01-29"],
          "birthPlace": [],
          "comment": [
            {
              "lang": "nl",
              "value": "Pieternella Cornelia (Nelleke) van der Krogt-van der Schraaf (Middelburg, 29 januari 1948) is een Nederlands presentatrice bij de AVRO. Ze is tegenwoordig woonachtig in de Betuwe."
            }
          ],
          "deathDate": [],
          "deathPlace": [],
          "guestedIn": [],
          "knownFor": [
            {
              "uri": "http://nl.dbpedia.org/resource/Tussen_Kunst_&_Kitsch",
              "lang": "",
              "value": "Tussen_Kunst_&_Kitsch"
            }
          ],
          "label": [
            {
              "lang": "nl",
              "value": "Nelleke van der Krogt"
            }
          ],
          "nationality": [],
          "predecessor": [],
          "presents": [],
          "profession": [],
          "successor": [],
          "thumb": []
        },
        {
          "locator": "http://nl.dbpedia.org/resource/Hessel_Martena",
          "duration": "100000",
          "title": "Hessel van Martena",
          "startTime": 44000,
          "index": 1,
          "type": ["person", "resource"],
          "birthDate": [],
          "birthPlace": [],
          "comment": [
            {
              "lang": "nl",
              "value": "Hessel Martena  was een figuur uit een sage betreffende de geschiedenis van Friesland. Martena wordt alleen vermeld in de fantasievolle kroniek van Andreas Cornelius.De sage omvat de volgende onderdelen:Martena (gekozen ca. 1306 - 16 augustus 1312) zou de tiende potestaat van Friesland zijn geweest.De initialen van Martena zijn J.H. dit kan staan voor Jan Hessels, Jonge Hessel of Jonker Hessel Martena.Martena wordt bijzonder geroemd om zijn schrander beleid, waardoor hij de toen reeds bestaande twisten tussen de Schieringers en Vetkopers van al te grote uitspattingen terughield.Na een driekwart eeuw nam er weer een hollandse graaf, Willem III van Holland een poging om de Frieslanden onder zijn bestuur te brengen. In 1309 landde hij met een vloot en 1500 \"koppen\" in Gaasterland. Al plunderend trok hij naar Stavoren. Onder aanvoering van Hessel moest graaf Willem weer vluchten naar zijn schepen.Na de dood van Hessel in 1312 nam het conflict tussen de Schieringers en Vetkopers weer toe. Over de benoeming van een volgende Potestaat konden de partijen het zelfs niet eens worden.Zijn leven is beschreven door Andreas Cornelius en door Johannes Vlieterp, de opvolger van de geschiedschrijver Occo Scarlensis.Hessel is de vader van Syds Hessels Martena, en de overgrootvader van Johan Sytses Martena, die ook wel de Friesche Duivel werd genoemd. Hij diende de Heer van Egmond."
            },
            {
              "lang": "nl",
              "value": "Hessel Martena was een figuur uit een sage betreffende de geschiedenis van Friesland. Martena wordt alleen vermeld in de fantasievolle kroniek van Andreas Cornelius. De sage omvat de volgende onderdelen: Martena zou de tiende potestaat van Friesland zijn geweest. De initialen van Martena zijn J.H. dit kan staan voor Jan Hessels, Jonge Hessel of Jonker Hessel Martena. Martena wordt bijzonder geroemd om zijn schrander beleid, waardoor hij de toen reeds bestaande twisten tussen de Schieringers en Vetkopers van al te grote uitspattingen terughield. Na een driekwart eeuw nam er weer een hollandse graaf, Willem III van Holland een poging om de Frieslanden onder zijn bestuur te brengen. In 1309 landde hij met een vloot en 1500 \"koppen\" in Gaasterland. Al plunderend trok hij naar Stavoren. Onder aanvoering van Hessel moest graaf Willem weer vluchten naar zijn schepen. Na de dood van Hessel in 1312 nam het conflict tussen de Schieringers en Vetkopers weer toe. Over de benoeming van een volgende Potestaat konden de partijen het zelfs niet eens worden. Zijn leven is beschreven door Andreas Cornelius en door Johannes Vlieterp, de opvolger van de geschiedschrijver Occo Scarlensis. Hessel is de vader van Syds Hessels Martena, en de overgrootvader van Johan Sytses Martena, die ook wel de Friesche Duivel werd genoemd. Hij diende de Heer van Egmond."
            },
            {
              "lang": "nl",
              "value": "Hessel Martena  was een figuur uit een sage betreffende de geschiedenis van Friesland. Martena wordt alleen vermeld in de fantasievolle kroniek van Andreas Cornelius.De sage omvat de volgende onderdelen:Martena (gekozen ca. 1306 - 16 augustus 1312) zou de tiende potestaat van Friesland zijn geweest.De initialen van Martena zijn J.H."
            },
            {
              "lang": "nl",
              "value": "Hessel Martena was een figuur uit een sage betreffende de geschiedenis van Friesland. Martena wordt alleen vermeld in de fantasievolle kroniek van Andreas Cornelius. De sage omvat de volgende onderdelen: Martena zou de tiende potestaat van Friesland zijn geweest. De initialen van Martena zijn J.H. dit kan staan voor Jan Hessels, Jonge Hessel of Jonker Hessel Martena."
            }
          ],
          "deathDate": [],
          "deathPlace": [],
          "label": [
            {
              "lang": "nl",
              "value": "Hessel Martena"
            }
          ],
          "nationality": [],
          "predecessor": [
            {
              "uri": "http://nl.dbpedia.org/resource/Reinier_Camminga",
              "lang": "nl",
              "value": "Reinier Camminga"
            }
          ],
          "profession": [],
          "successor": [
            {
              "uri": "http://nl.dbpedia.org/resource/Juw_Juwinga",
              "lang": "",
              "value": "Juw_Juwinga"
            }
          ],
          "thumb": []
        },
        {
          "locator": "http://nl.dbpedia.org/resource/Museum_Martena",
          "duration": "149000",
          "title": "Museum Martena",
          "startTime": 56000,
          "index": 2,
          "type": ["museum", "place", "resource"],
          "architect": [],
          "architecture": [],
          "builtBy": [],
          "builtYear": [],
          "comment": [
            {
              "lang": "nl",
              "value": "Museum Martena is het stadsmuseum van Franeker in de provincie Friesland. Het is gevestigd in de Martenastins, een stins die door de Friese edelman Hessel van Martena (ca. 1460-1517) is gebouwd. Vroeger heette het museum 't Coopmanshuis. Na de verhuizing van het museum van het Coopmanshuis naar de Martenastins, nam het museum zijn huidige naam aan.Museum Martena herbergt de historische collectie van de stad Franeker, de collectie over de Universiteit van Franeker en bezit ook de grootste collectie over en van Anna Maria van Schurman. In het museum is één van de enige drie xylotheken van Nederland te zien. Deze is met 158 banden tevens de grootste van de drie.Het museum organiseert regelmatig tentoonstellingen van moderne kunst van jonge Friese kunstenaars. Ook wordt elk jaar een historische tentoonstelling gemaakt."
            },
            {
              "lang": "nl",
              "value": "Museum Martena is het stadsmuseum van Franeker in de provincie Friesland. Het is gevestigd in de Martenastins, een stins die door de Friese edelman Hessel van Martena (ca. 1460-1517) is gebouwd. Vroeger heette het museum 't Coopmanshuis."
            }
          ],
          "label": [
            {
              "lang": "nl",
              "value": "Museum Martena"
            }
          ],
          "attributes": {
            "locatedIn": [
              {
                "uri": "http://nl.dbpedia.org/resource/Franeker",
                "lang": "nl",
                "value": "Franeker"
              },
              {
                "uri": "http://nl.dbpedia.org/resource/Friesland",
                "lang": "nl",
                "value": "Fryslân"
              }
            ]
          }
        },
        {
          "locator": "http://nl.dbpedia.org/resource/Franeker",
          "duration": "149000",
          "title": "Franeker",
          "startTime": 57000,
          "index": 3,
          "type": ["place", "resource"],
          "comment": [
            {
              "lang": "nl",
              "value": "Franeker (Fries: Frjentsjer) is de hoofdplaats van de gemeente Franekeradeel, in de provincie Friesland (Nederland). De stad telt 12.900 inwoners (2009) en is één van de Friese elf steden. De stad maakt sinds 1 januari 1984 deel uit van de gemeente Franekeradeel."
            },
            {
              "lang": "nl",
              "value": "Franeker is de hoofdplaats van de gemeente Franekeradeel, in de provincie Friesland. De stad telt 12.900 inwoners (2009) en is één van de Friese elf steden. De stad maakt sinds 1 januari 1984 deel uit van de gemeente Franekeradeel."
            }
          ],
          "label": [
            {
              "lang": "nl",
              "value": "Franeker"
            }
          ],
          "attributes": {
            "population": ["12900"]
          },
          "thumb": ["http://upload.wikimedia.org/wikipedia/commons/c/c6/Franeker_Voorstraat.jpg", "http://upload.wikimedia.org/wikipedia/commons/6/6e/Flag_of_Franeker.svg", "http://upload.wikimedia.org/wikipedia/commons/f/fd/Franeker_wapen'.jpg"],
        }
      ];


    },
    templateUrl: 'partials/directives/entity-slider.html'
  }
}
