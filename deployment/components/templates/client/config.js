'use strict';

angular.module('Config', []).constant('Config', {
  ENTITY_PROXY: 'http://linkedtv.project.cwi.nl/explore/entity_proxy',
  EUROPEANA_API: 'http://europeana.eu/api/v2',
  IR_API: 'http://{{app_address}}/ir',

  app_title_prefix: 'LinkedTV Culture',
  users: [
    {
      name: 'Rita',
      avatar: 'img/Rita.png',
      id: 'rita'
    },
    {
      name: 'Bert & Anne',
      avatar: 'img/Anne.jpg',
      id: 'bertanne'
    },
    {
      name: 'Michael',
      avatar: 'img/Michael.jpg',
      id: 'michael'
    }
  ],

  springfield_ip: window.location.hostname,
  springfield_port: window.location.port,
  springfield_app: 'news',
  springfield_fullapp: '/domain/linkedtv/user/{}/html5application/news',
  springfield_appparams: ""
});
