'use strict'
/*
*/


/*
*/
module.exports = class LogConfig {
    config = {}

    constructor(config) {
        this.config = config

        if (this.config.log_level) this.config.log_level = this.config.log_level.toUpperCase()

        /*
        if (namespace) this.namespace = namespace 
        else this.namespace = ''
        this.hostname = os.hostname()
        this.log_levels = Object.freeze({ "TRACE": 0, "DEBUG": 1, "INFO": 2, "WARN": 3, "ERROR": 4, "FATAL": 5 })
        this.log_levelid = -1
        */
    }


    get() {
        return this.config
    }


}
