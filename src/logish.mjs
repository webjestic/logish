
import Debug from 'debug'
const debug = Debug('logish:class')
import config from './config.mjs'
import { EventEmitter } from 'events'
import { Controllers } from './controllers.mjs'
import { LogEntry } from './logEntry.mjs'


/**
 * Responsible for handling actual log events by ensuring the configuration and 
 * incoming entry meets the required specifications. Routes entries to the device
 * controllers and triggers any log events.
 * 
 */
export class Logish extends EventEmitter {

    /** @member {string} - namespace used for logging */
    #namespace = undefined

    /** @member {Object} - class Config */
    #config = undefined

    /** @member {Object} - class Controllers */
    #controllers = undefined

    /** @member {Object} - json object holding LOGISH environment variables. */
    #env = undefined

    /**
     * Constructor used to validate arguments, create instances, and trigger steup.
     * 
     * @param {object} config 
     * @param {string} namespace 
     */
    constructor(customConfig, namespace) {
        super()
        debug('constructor')

        // assign the existing Config class instance 
        this.#config = config

        // load a conifguration, after validating the constructor arguments
        this.#config.configure(
            this.#resolveConstructorArgs(customConfig, namespace)
        )
        debug('namespace %o', this.#namespace)

        // create an instance of the Controllers class
        this.#controllers = new Controllers()

        this.#setup()
    }

    get controllers() { return this.#controllers.controllers }
    get config() { return this.#config.json }
    get namespace() { return this.#namespace }

    /**
     * Method validates constructor arguments and resolves accordingly.
     * 
     * @access Protected
     * @param {object} config - Custom configuration json object for Logish.
     * @param {string} namespace - Used to filter debug and trace log entries for verbose.
     * @returns {object} - Returns a acceptable config object for the Config instance.
     */
    #resolveConstructorArgs(config, namespace) {
        debug('resolveConstructorArgs %O', config, namespace)

        if (typeof config === 'string' && typeof namespace === 'undefined') {
            debug('Preparing for DEFAULT config and a DEFINED namespace.')
            this.#namespace = config
            return undefined
        }

        if (typeof config === 'undefined' && typeof namespace === 'undefined') {
            debug('Preparing for DEFAULT config and NO namespace.')
            this.#namespace = undefined
            return undefined
        }

        if (typeof config === 'object' && typeof namespace === 'undefined') {
            if (!Array.isArray(config)) {
                debug('Preparing for CUSTOM config and NO namespace.')
                this.#namespace = undefined
                return config
            } else {
                throw new Error('Invalid new Logish() config argument. Cannot be of type Array.')
            }
        }

        if (typeof config === 'object' && typeof namespace === 'string') {
            if (!Array.isArray(config)) {
                debug('Preparing for CUSTOM config and CUSTOM namespace.')
                this.#namespace = namespace
                return config
            } else {
                throw new Error('Invalid new Logish() config argument. Cannot be of type Array.')
            }
        } else {
            throw new Error('Invalid new Logish() constructor arguments.')
        }
    }

    /**
     * Method executes all class initialization and setup steps.
     * 
     * @access Protected
     */
    #setup() {
        debug('setup')
        this.#setupControllers()
        this.#setupEnv()
        this.#setupLevelMethods()
    }

    /**
     * Method reads values for LOGISH environment variables.
     * 
     * @access Protected
     */
    #setupEnv() {
        debug('setupEnv')
        this.#env = {}
        Object.keys(process.env).forEach(key => {
            if (key.toUpperCase().includes('LOGISH'))
                this.#env[key] = process.env[key]
        })
        debug('env: %O', this.#env)
    }

    /**
     * Method creates the alias names for the log method. info(), warn(), debug(), etc,.
     * 
     * @access Protected
     */
    #setupLevelMethods() {
        debug('setupLevelMethods')
        const levels = this.#config.json.levels
        Object.keys(levels).forEach(method => {
            this[method.toLowerCase()] = this.log.bind(this, method.toLowerCase())
        })
    }

    /**
     * Method used to add log entries for all log levels. 'log' defaults to 'info'.
     * 
     * @access Public
     * @param {any} args 
     */
    log(...args) {
        debug('log')
        debug('log args %O', args)
        debug('log arguments %O', arguments)

        // terminte the process if a valid log level is not being used.
        if (this.#config.json.levels[args[0].toUpperCase()] === undefined)
            throw new Error('Invalid log level method alias used. Try info(), debug(), or any valid log level.')
        if (!this.#allowLevelEntry(args[0])) return false

        var logEntry = new LogEntry()
        this.#controllers.log(args[0])

        /* Raise a Log Event. Created on every log entry. */
        //this.emit('LogEvent', logEntry)
        return true
    }

    /**
     * Determine if the log level attempt is allowed. 
     * 
     * @access Protected
     * @param {string} level 
     * @returns true or false
     */
    #allowLevelEntry(level) {
        debug('allowLevelEntry')

        debug('Config Levels:', this.#config.json.levels)
        debug('Defined Level:', this.#config.json.level)
        debug('Defined Level ID:', this.#config.json.levels[this.#config.json.level.toUpperCase()])
        debug('Logging Level ID:', this.#config.json.levels[level.toUpperCase()])

        return (this.#config.json.levels[level.toUpperCase()] <= this.#config.json.levels[this.#config.json.level.toUpperCase()])

    }

    /**
     * Method uses config.controllers to create actual class controllers.
     * 
     * @access Protected
     */
    #setupControllers() {
        debug('setupControllers')
        for (let controller of this.#config.json.controllers) {
            this.addController(controller)
        }
    }

    /**
     * Method exists to allow external (and internal) controllers to be added.
     * 
     * @access Public
     * @param {object} controller - Json object, usually defined in logish_config.controllers[]
     */
    addController(controller) {
        debug('addController')
        this.#controllers.addController(controller)
    }

}