import angular from 'angular'
import ngResource from 'angular-resource'

function User ($resource) {
  // $resource(url, [paramDefaults], [actions], options);

  return $resource('/api/users/:id/:controller', {
    id: '@_id'
  },
    {
      changePassword: {
        method: 'PUT',
        params: {
          controller: 'password'
        }
      },
      get: {
        method: 'GET',
        params: {
          id: 'me'
        }
      }
    })
}

export default angular.module('bitfit.services.user', [ngResource])
  .factory('User', User)
  .name
