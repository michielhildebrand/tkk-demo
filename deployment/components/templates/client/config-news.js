'use strict';

angular.module('Config', []).constant('Config', {
  ENTITY_PROXY: 'http://linkedtv.project.cwi.nl/explore/entity_proxy',
  EUROPEANA_API: 'http://europeana.eu/api/v2',
  IR_API: 'http://{{app_address}}/ir',
  CONTENT_FILTERING_API: 'http://{{app_address}}/filtering',
  DOCUMENT_PROXY: 'http://{{app_address}}/doc',
  LINKEDTV_SPARQL: 'http://{{app_address}}/linkedtv_sparql',
  GAIN_API: '/gain',
  
  app_title_prefix: 'LinkedTV News',
  users: [
    {
      name: 'Ralph',
      avatar: 'img/Ralph.png',
      id: 'ralph'
    },
    {
      name: 'Peter',
      avatar: 'img/Peter.png',
      id: 'peter'
    },
    {
      name: 'Nina',
      avatar: 'img/Nina.png',
      id: 'rbb1'
    }
  ],

  db: 'rbb',
  seed: '/seeds/news-videos.json',

  tracking_enabled_default: true,

  synchronize_model: false,

  lookupMode: true,

  springfield_ip: "a1.noterik.com",
  springfield_port: 80,
  springfield_app: "linkedtvhbbtvels",
  springfield_fullapp: '/domain/linkedtv/user/{}/html5application/linkedtvhbbtvels',

  debug_enabled: false

});
