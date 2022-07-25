
import Debug from 'debug'
const debug = Debug('logish:config')

/**
 * Responsible for ensuring the integrity of the logish configuration.
 * Creating, updating, validating and reconciliation.
 */
class Config {

    /* the actual configuration key:value pairs */
    #json = undefined

    /**
     * The default Logish configuration.
     */
    #defaultConfig = {
        levels : Object.freeze({ 'TRACE': 0, 'DEBUG': 1, 'INFO': 2, 'WARN': 3, 'ERROR': 4, 'FATAL': 5 }),
        level : 'INFO',
        debugging : {
            namespaceOnly : false,
            performanceTime : true
        },
        controllers : [
            {
                name: 'ControlConsole',
                module : './controlConsole.mjs',
                active: true
            },
            {
                name: 'ControlFile',
                module : './controlFile.mjs',
                active: true
            }
        ]
    }

    /**
     * No default configuration assigned during object creation. Singeton created
     * during module initialization of this module.
     * 
     * this.configure() must be called after creation to assign a valid configuration.
     */
    constructor() {
        debug('constructor')
    }

    get json() { return this.#json }
    set json(value) { this.#json = this.#resolveConfigure(value) }


    /**
     * Ideally called to initialize a logish configuration. This method is
     * responsible for 
     * 
     * @access Public
     * @param {object} config 
     * @returns returns true if a successful configuration was applied.
     */
    configure(config) {
        debug('configure')
        this.#json = this.#resolveConfigure(config)
        return true
    }

    /**
     * Validates, repairs, creates or updates a logish configuration for use. 
     * Return a valid conifguration instead of assigning it, allowing for additional 
     * manipulation before actual this.json assignment.
     * 
     * @access Protected
     * @param {object} config 
     * @returns config
     */
    #resolveConfigure(config) {
        debug('resolveConstructorArgs')
        debug('config arg: %O', config)
        let custom = this.#defaultConfig

        if (config !== undefined && typeof config === 'object') {
            debug('assigning custom config')
            if (typeof config.level === 'string') 
                 if (this.#defaultConfig.levels[config.level.toUpperCase()] > -1) 
                    custom.level = config.level

            if (config.debugging !== undefined && typeof config.debugging === 'object') {
                if (typeof config.debugging.namespaceOnly === 'boolean')
                    custom.debugging.namespaceOnly = config.debugging.namespaceOnly

                if (typeof config.debugging.performanceTime === 'boolean')
                    custom.debugging.performanceTime = config.debugging.performanceTime
            }
            
            if (config.controllers !== undefined && typeof config.controllers === 'object') 
                custom.controllers = config.controllers
            

        }

        // assign default configuration
        if (config === undefined || config === {}) {
            debug ('returning default config %O', this.#defaultConfig) 
            custom = this.#defaultConfig
        }
        
        return custom
    }

    /**
     * Adds a new controller to the configuration.
     * 
     * @param {object} controller 
     * @returns true - indicates we've reached the end of the routine without any exceptions
     */
    addController(controller) {
        debug('addController')
        debug('controller %O', controller)
        debug(typeof controller) 

        // Validate minimum requirements of controller config object.
        if (typeof controller !== 'object')
            throw new Error('controller is required but typeof is not object.')
        if (typeof controller.name !== 'string') 
            throw new Error('controller.name is required but is not typeof string.')
        if (typeof controller.module !== 'string') 
            throw new Error('controller.module is required but is not typeof string.')
        if (typeof controller.active !== 'boolean') 
            throw new Error('controller.active is required but is not typeof boolean.')

        // Validate the controller being added does not already exist.
        let exists = false
        for (let existingController of this.#json.controllers) {
            if (existingController.module === controller.module) {
                exists = true
                break
            }
        }
        if (!exists) {
            this.#json.controllers.push(controller)
            debug('controller inserted to config: %O', this.#json.controllers)
        }

        return true
    }
}

debug('config.mjs')
var config = new Config

/**
 * Export an instance if the config Class.
 */
export default config
