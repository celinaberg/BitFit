import angular from 'angular'
import _ from 'lodash'
import io from 'angular-socket-io'

angular.module('bitfit.services.socket', ['socketFactory'])
  .factory('socket', (socketFactory) => {
    // socket.io now auto-configures its connection when we ommit a connection url
    const ioSocket = io('', {
      // Send auth token on connection, you will need to DI the Auth service above
      // 'query': 'token=' + Auth.getToken()
      path: '/socket.io-client'
    })

    const socket = socketFactory({
      ioSocket
    })

    return {
      socket,

      /**
       * Register listeners to sync an array with updates on a model
       *
       * Takes the array we want to sync, the model name that socket updates are sent from,
       * and an optional callback function after new items are updated.
       *
       * @param {String} modelName
       * @param {Array} array
       * @param {Function} cb
       */
      syncUpdates (modelName, array, cb) {
        cb = cb || angular.noop

        /**
         * Syncs item creation/updates on 'model:save'
         */
        socket.on(`${modelName}:save`, (item) => {
          const oldItem = _.find(array, { _id: item._id })
          const index = array.indexOf(oldItem)
          let event = 'created'

          // replace oldItem if it exists
          // otherwise just add item to the collection
          if (oldItem) {
            array.splice(index, 1, item)
            event = 'updated'
          } else {
            array.push(item)
          }

          cb(event, item, array)
        })

        /**
         * Syncs removed items on 'model:remove'
         */
        socket.on(`${modelName}:remove`, (item) => {
          const event = 'deleted'
          _.remove(array, { _id: item._id })
          cb(event, item, array)
        })
      },

      /**
       * Removes listeners for a models updates on the socket
       *
       * @param modelName
       */
      unsyncUpdates (modelName) {
        socket.removeAllListeners(`${modelName}:save`)
        socket.removeAllListeners(`${modelName}:remove`)
      }
    }
  })
