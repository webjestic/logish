'use strict'
/** 
*/

const Log = require('./src/index')
module.exports = function(config, namespace) {
    return new Log(config, namespace)
}
