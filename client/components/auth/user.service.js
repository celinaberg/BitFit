'use strict';

angular.module('its110App')
  .factory('User', function ($resource) {
    // $resource(url, [paramDefaults], [actions], options);

    return $resource('/api/users/:id/:controller', {
      id: '@_id'
    },
    {
      changePassword: {
        method: 'PUT',
        params: {
          controller:'password'
        }
      },
      get: {
        method: 'GET',
        params: {
          id:'me'
        }
      }
	  });
  });
