'use strict';

angular.module('MediaResource', ['ngResource']).factory('mediaResource', ['$resource', 'CONFIG', mediaResourceService]);

function mediaResourceService($resource, CONFIG) {
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
