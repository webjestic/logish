'use strict'
/*
*/


/*
*/
module.exports = class LogConfig {
    config = {}

    /*
    */
    constructor(config) {
        this.config = config

        this.validateRoot()
        this.validateDebugging()
        this.validateConsole()
        this.validateFileCcontrollers()

    }

    /*
    */
    validateRoot() {
        if (this.config.log_level === undefined) {
            this.config.log_level = 'INFO' // default
        } else {
            this.config.log_level = this.config.log_level.toUpperCase()
            let valid = false
            switch (this.config.log_level) {
                case 'TRACE' : valid = true
                case 'DEBUG' : valid = true
                case 'INFO' : valid = true
                case "WARN" : valid = true
                case "ERROR" : valid = true
                case "FATAL" : valid = true 
            }
            if (!valid) {
                throw error (`value for config.log_level is not valid.`)
            }
        }
    }

    /*
    */
    validateDebugging() {
        if (this.config.debugging === undefined) {
            this.config.debugging = { // default
                log_perf_hooks: true,
                log_only_namespace: false                
            }
        } else {

            if (this.config.debugging.log_perf_hooks === undefined) 
                this.config.debugging.log_perf_hooks = true  // default
            if (this.config.debugging.log_only_namespace === undefined) 
                this.config.debugging.log_perf_hooks = false // default

            if ( typeof this.config.debugging !== 'object' )
                throw Error ('config.debugging is not of type "object"')
            if (typeof this.config.debugging.log_perf_hooks !== 'boolean') 
                throw Error ('value of config.debugging.log_perf_hooks is not boolean')
            if (typeof this.config.debugging.log_only_namespace !== 'boolean') 
                throw Error ('value of config.debugging.log_only_namespace is not boolean')
        }
    }

    /*
    */
    validateConsole() {
        if (this.config.console === undefined) {
            this.config.console = {     // default
                format : '%namespace [%level] %entry %data | %perf',
                use_colors : true,
                display_levels : ["trace", "debug", "info", "warn", "error", "fatal"],
                colors : {
                    trace   : "\x1b[32m",    debug   : "\x1b[36m",
                    info    : "\x1b[37m",    warn    : "\x1b[33m",
                    error   : "\x1b[35m",    fatal   : "\x1b[31m"
                }
            }
        } else {

            if (this.config.console.format === undefined)
                this.config.console.format = '%namespace [%level] %entry %data | %perf' // default
            if (this.config.console.use_colors === undefined) 
                this.config.console.use_colors = true   // default
            if (this.config.console.display_levels === undefined) 
                this.config.console.display_levels = ["trace", "debug", "info", "warn", "error", "fatal"] // default

            if (this.config.console.colors === undefined) 
                this.config.console.colors = {  // default
                    trace   : "\x1b[32m",    debug   : "\x1b[36m",
                    info    : "\x1b[37m",    warn    : "\x1b[33m",
                    error   : "\x1b[35m",    fatal   : "\x1b[31m"
                }                
            if (this.config.console.colors.trace === undefined)
                this.config.console.colors.trace = "\x1b[32m"   // default
            if (this.config.console.colors.debug === undefined)
                this.config.console.colors.trace = "\x1b[36m"   // default
            if (this.config.console.colors.info === undefined)
                this.config.console.colors.info = "\x1b[37m"    // default
            if (this.config.console.colors.warn === undefined) 
                this.config.console.colors.warn = "\x1b[33m"    // default
            if (this.config.console.colors.error === undefined)   
                this.config.console.colors.error = "\x1b[35m"   // default
            if (this.config.console.colors.fatal === undefined) 
                this.config.console.colors.fatal = "\x1b[31m"   // default

            if ( typeof this.config.console.format !== 'string' )
                throw Error ('config.console.format is not of type "string"')
            if ( typeof this.config.console.use_colors !== 'boolean')
                throw Error ('config.console.format is not of type "boolean"')
            if ( typeof this.config.console.display_levels !== 'object')
                throw Error ('config.console.format is not of type "object"')
            if ( typeof this.config.console !== 'object' )
                throw Error ('config.console is not of type "object"')
            if ( typeof this.config.console.colors.trace !== 'string' )
                throw Error ('config.console.colors.trace is not of type "string"')
            if ( typeof this.config.console.colors.debug !== 'string' )   
                throw Error ('config.console.colors.debug is not of type "string"')
            if ( typeof this.config.console.colors.info !== 'string' )    
                throw Error ('config.console.colors.info is not of type "string"')
            if ( typeof this.config.console.colors.warn !== 'string' )  
                throw Error ('config.console.colors.warn is not of type "string"')
            if ( typeof this.config.console.colors.error !== 'string' ) 
                throw Error ('config.console.colors.error is not of type "string"')
            if ( typeof this.config.console.colors.fatal !== 'string' ) 
                throw Error ('config.console.colors.fatal is not of type "string"')
        }
    }


    /* 
    */
    validateFileCcontrollers() {
        
        //  config.file_controllers is not required and may not exist in the configuration.
        //  therefore, no effort will be made to create a default.
        if (this.config.file_controllers) {
            if (typeof this.config.file_controllers === 'object') {
                for (let controller of this.config.file_controllers) {
                    this.validateFileController(controller)
                }
            } else {
                throw Error ('config.file_controllers is not typeof "object"')
            }   
        }
    }


    /*
    */
    validateFileController(controller) {

        // even though a controller is not required, if one exits
        // we will validate all the keys - even the name.
        //
        if (controller.name === undefined || typeof controller.name !== 'string' )
            throw Error ('file_controllers.controller.name is not typeof "string"')
        
        if (controller.tofile === undefined || typeof controller.tofile !== 'boolean' )
            throw Error ('file_controllers.controller.tofile is not typeof "boolean"')

        if (controller.levels === undefined || typeof controller.levels !== 'object' )
            throw Error ('file_controllers.controller.levels is not typeof "object"')

        if (controller.file === undefined || typeof controller.file !== 'object' )
            throw Error ('file_controllers.controller.file is not typeof "object"')

        if (controller.file.format === undefined || typeof controller.file.format !== 'string' )
            throw Error ('file_controllers.controller.file.format is not typeof "string"')

        if (controller.file.date === undefined || typeof controller.file.date !== 'string' )
            throw Error ('file_controllers.controller.file.date is not typeof "string"')

        if (controller.file.filename === undefined || typeof controller.file.filename !== 'string' )
            throw Error ('file_controllers.controller.file.filename is not typeof "string"')

        if (controller.file.maxsize_in_mb === undefined || typeof controller.file.maxsize_in_mb !== 'number' )
            throw Error ('file_controllers.controller.file.maxsize_in_mb is not typeof "number"')

        if (controller.file.backups_kept === undefined || typeof controller.file.backups_kept !== 'number' )
            throw Error ('file_controllers.controller.file.backups_kept is not typeof "number"') 
        
        if (controller.file.gzip_backups === undefined || typeof controller.file.gzip_backups !== 'boolean' )
            throw Error ('file_controllers.controller.file.gzip_backups is not typeof "boolean"')  
    }


    get() {
        return this.config
    }
}
