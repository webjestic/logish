
import Debug from 'debug'
const debug = Debug('logish:config')



/**
 * Responsible for ensuring the integrity of the logish configuration.
 * Creating, updating, validating and reconciliation.
 */
export class Config {

    #configDefaultSchema = {
        levels: Object.freeze({ 'TRACE': 0, 'DEBUG': 1, 'INFO': 2, 'WARN': 3, 'ERROR': 4, 'FATAL': 5 }),
        level : 'trace',
        performanceTime : true,
        controllers : [
            {
                name: 'console',
                classname: 'ControlConsole',
                module : './controlConsole.mjs',
                active: true,
                displayLevels : ['trace', 'debug', 'info', 'warn', 'error', 'fatal'],
                format : '%datetime %level %namespace %entry %performance',
                useColor: true,
                colors : {
                    trace   : '\x1b[32m',    debug   : '\x1b[36m',
                    info    : '\x1b[37m',    warn    : '\x1b[33m',
                    error   : '\x1b[35m',    fatal   : '\x1b[31m',
                    reset   : '\x1b[0m'
                }
            },
            {
                name: 'file',
                classname: 'ControlFile',
                module : './controlFile.mjs',
                active: true,
                files: [
                    {
                        title: 'application',
                        active : true,
                        writeLevels: ['info', 'warn'],
                        format : '[%date] [%level] %namespace %host %protocol %ip - %entry %performance',
                        filename: 'logs/app.log',   
                        maxsize_in_mb: 2,
                        backups_kept: 2, 
                        gzip_backups : false
                    },
                    {
                        title: 'errors',
                        active : true,
                        writeLevels: ['error', 'fatal'],
                        format : '[%date] [%level] %namespace %host %protocol %ip - %entry %perf',
                        filename: 'logs/errors.log',   
                        maxsize_in_mb: 2,
                        backups_kept: 2, 
                        gzip_backups : false
                    },
                    {
                        title: 'development',
                        active : true,
                        writeLevels: ['trace', 'debug'],
                        format : '[%date] [%level] %namespace %host %protocol %ip - %entry %perf',
                        filename: 'logs/dev.log',   
                        maxsize_in_mb: 2,
                        backups_kept: 2, 
                        gzip_backups : false
                    }
                ]
            }
        ]
    }

    #levelsdef = this.#configDefaultSchema.levels
    #json = null

    /** Pattern: Singleton */
    constructor(configJSON) {
        debug('constructor')

        if (!Config.instance) {
            if (!this.configure(configJSON))
                throw new Error('Unable to create instance - no validated configuration available.')
            else
                Config.instance = this
        }
        return Config.instance
    }
    
    getInstance() { return Config.instance }
    getConfig() { return this.#json }
    getLevels() { return this.#levelsdef }
    get json() { return this.#json }

    /**
     * 
     * @param {object} configJSON 
     * @returns boolean
     */
    configure(customConfig) {
        debug('configure')
        //debug('configJSON %O', configJSON)

        let result = false
        if (customConfig !== undefined && typeof customConfig === 'object') {
            if (this.validate(customConfig)) {
                this.#json = this.#configDefaultSchema
                this.#assignConfigValues(customConfig)
                result = true
            }
        } else {
            // completely assign default values to the configuration
            this.#json = this.#configDefaultSchema
            result = true
        }
        return result
    }

    /**
     * 
     * @param {object} customConfig 
     * @returns boolean
     */
    validate(customConfig) {
        debug('validate')

        // customConfig is validated to be typeof object by this.configure at this point

        if ( customConfig.level !== undefined && typeof customConfig.level === 'string') {
            if (this.#configDefaultSchema.levels[customConfig.level.toUpperCase()] === undefined)
                throw new Error('Provided config.level is not a valid logish level.')
        } else {
            throw new Error('Provided config.level is not typeof "string".')
        }

        if (customConfig.performanceTime !== undefined && typeof customConfig.performanceTime !== 'boolean') 
            throw new Error('Provided config.performanceTime is not typeof "boolean".')
        
        if (customConfig.controllers !== undefined && typeof customConfig.controllers === 'object') {
            if (!Array.isArray(customConfig.controllers))
                throw new Error('Provided config.controllers is not typeof "array".')

        } else {
            throw new Error('Provided config.controllers is not typeof "object".')
        }

        // cannot and should not validate controller specific configurations.
        // this needs to be handled within the controller itself. this validation
        // action is handled within the controller constructor. therefore, if we 
        // are here, then the validation for config is complete.

        // if controllers are provided in customConfig, then assign the controllers

        return true
    }

    /**
     * 
     * @param {*} customConfig 
     */
    #assignConfigValues(customConfig) {
        debug('assignConfigValues')

        if (customConfig.level !== undefined) this.json.level = customConfig.level
        else this.json.level = this.#configDefaultSchema.level

        if (customConfig.performanceTime !== undefined) this.json.performanceTime = customConfig.performanceTime
        else this.json.performanceTime = this.#configDefaultSchema.performanceTime

        if (customConfig.controllers !== undefined) this.json.controllers = customConfig.controllers
        else this.json.controllers = this.#configDefaultSchema.controllers
    }
}
