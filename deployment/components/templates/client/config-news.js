'use strict';

angular.module('Config', []).constant('Config', {
  ENTITY_PROXY: 'http://linkedtv.project.cwi.nl/explore/entity_proxy',
  EUROPEANA_API: 'http://europeana.eu/api/v2',
  IR_API: 'http://{{app_address}}/ir',

  app_title_prefix: 'LinkedTV News',
  users: [
    {
      name: 'Ralph',
      avatar: 'img/anonym.jpg',
      id: 'ralph'
    },
    {
      name: 'Peter',
      avatar: 'img/anonym.jpg',
      id: 'peter'
    },
    {
      name: 'Nina',
      avatar: 'img/anonym.jpg',
      id: 'nina'
    }
  ],

  springfield_ip: window.location.hostname,
  springfield_port: window.location.port,
  springfield_app: 'news',
  springfield_fullapp: '/domain/linkedtv/user/{}/html5application/news',
  springfield_appparams: ""
});
