'use strict';

angular.module('ContentFiltering', ['ngResource']).factory('contentFiltering', ['$resource', 'Config', contentFilteringResource]);

function contentFilteringResource($resource, Config) {
  return $resource(Config.CONTENT_FILTERING_API + '?uid=:uid', { uid: '@user' },
    {
      personalize: {
        method: 'post'
      }
    }
  );
}
