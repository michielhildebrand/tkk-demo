'use strict';

angular.module('ContentFiltering', ['ngResource']).factory('contentFiltering', ['$resource', 'Config', 'Model', contentFilteringResource]);

function contentFilteringResource($resource, Config, Model) {
  return $resource(Config.CONTENT_FILTERING_API + '/:action?uid=' + Model.getUser().toLowerCase(), { },
    {
      personalize: {
      	params: {
      		action:'@action'
      	},
        method: 'POST',
        headers: {'Content-Type': 'application/json'}
      }
    }
  );
}
