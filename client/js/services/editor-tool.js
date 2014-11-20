'use strict';

angular.module('EditorTool', ['ngResource']).factory('editorTool', ['$resource', 'Config', editorToolResource]);

function editorToolResource($resource, Config) {
  return $resource('http://editortoolv2.linkedtv.eu/load_curated_et', { },
    {
      get: {
        method: 'GET',
        url: 'http://editortoolv2.linkedtv.eu/load_curated_et' + '?id=:id',
        params: {
          id: "@id"
        }
      }
    }
  );
}
