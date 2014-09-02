'use strict';

angular.module('Config', []).constant('Config', {
  ENTITY_PROXY: 'http://linkedtv.project.cwi.nl/explore/entity_proxy',
  EUROPEANA_API: 'http://europeana.eu/api/v2/search.json',

  app_title_prefix: 'LinkedTV Culture',
  users: ['Rita', 'Bert & Anne', 'Michael'],

  springfield_ip: window.location.hostname,
  springfield_port: window.location.port,
  springfield_app: 'news',
  springfield_fullapp: '/domain/linkedtv/user/{}/html5application/news',
  springfield_appparams: ""
});