'use strict';

angular.module('Config', []).constant('Config', {
  ENTITY_PROXY: 'http://linkedtv.project.cwi.nl/explore/entity_proxy',
  EUROPEANA_API: 'http://europeana.eu/api/v2',
  IR_API: 'http://{{app_address}}/ir',
  CONTENT_FILTERING_API: 'http://{{app_address}}/filtering',
  DOCUMENT_PROXY: 'http://{{app_address}}/doc',
  LINKEDTV_SPARQL: 'http://{{app_address}}/linkedtv_sparql',

  app_title_prefix: 'LinkedTV Culture',
  users: [
    {
      name: 'Rita',
      avatar: 'img/Rita.png',
      id: 'rita'
    },
    {
      name: 'Bert & Anne',
      avatar: 'img/Bert.png',
      id: 'bert_and_anne'
    },
    {
      name: 'Michael',
      avatar: 'img/Michael.jpg',
      id: 'michael'
    }
  ],

  db: 'sv',
  seed: '/doc/sv/videos',

  tracking_enabled_default: true,

  synchronize_model: false,

  springfield_ip: window.location.hostname,
  springfield_port: window.location.port,
  springfield_app: 'news',
  springfield_fullapp: '/domain/linkedtv/user/{}/html5application/news',

  debug_enabled: true
});
