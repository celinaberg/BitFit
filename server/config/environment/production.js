'use strict';

// Production specific configuration
// =================================
module.exports = {
  // Server IP
  ip:       '192.168.2.100' ||
            process.env.IP ||
            undefined,

  // Server port
  port:     80, 
//||
           // process.env.PORT ||
           // 8080,

  // MongoDB connection options
  mongo: {
    uri:    process.env.MONGOLAB_URI ||
            process.env.MONGOHQ_URL ||
            process.env.OPENSHIFT_MONGODB_DB_URL+process.env.OPENSHIFT_APP_NAME ||
            'mongodb://localhost/its110'
  }
};
