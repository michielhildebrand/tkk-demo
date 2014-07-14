'use strict';

var tkkServices = angular.module('tkkServices', ['ngResource']);

tkkServices.factory('mediaResourceService', ['$resource', 'CONFIG',
    function ($resource, CONFIG) {
      return $resource(CONFIG.API_ROOT + '/mediaresource/:id/:path', { id: '@id', _page: 0 },
        {
          get: {
            method: 'GET'
          },
          mediafragments: {
            method: 'GET',
            params: { path: 'mediafragment' }
          },
          annotations: {
            method: 'GET',
            params: { path: 'annotations' }
          }
        }
      );
    }
  ]
);