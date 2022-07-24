
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
            performance_time : true
        },
        controllers : [
            {
                name: 'ControlConsole',
                module : './controlConsole.mjs'
            },
            {
                name: 'ControlFile',
                module : './controlFile.mjs'
            }
        ]
    }

    /**
     * No default configuration assigned during object creation.
     * this.configure() must be called to assign a valid configuration.
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
        //debug('this.json %O', this.#json)
        return true
    }

    /**
     * Validates, repairs, prepares or updates a logish configuration for use. 
     * Return a valid conifguration instead of assigning it, allowing for additional 
     * manipulation before actual this.json assignment.
     * 
     * @access Protected
     * @param {object} config 
     * @returns config
     */
    #resolveConfigure(config) {
        debug('resolveConstructorArgs')
        config = this.#defaultConfig
        return config
    }
}

debug('config.mjs')
var config = new Config

/**
 * Export an instance if the config Class.
 */
export default config
