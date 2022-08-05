
import Debug from 'debug'
const debug = Debug('logish:config')
import Ajv from 'ajv'

/**
 * Responsible for ensuring the integrity of the logish configuration.
 * Creating, updating, validating and reconciliation.
 */
export class Config {

    #levelsdef = Object.freeze({ 'TRACE': 0, 'DEBUG': 1, 'INFO': 2, 'WARN': 3, 'ERROR': 4, 'FATAL': 5 })
    #json = null

    controlSchema = {
        type: 'object',
        properties: {
            name : { type: 'string' },
            classname: { type: 'string' },
            module : { type: 'string' },
            active: { type: 'boolean', default: 'true' },
        },
        required: ['classname', 'module'],
        additionalProperties: true
    }

    controllersSchema = {
        type: 'array',
        items: this.controlSchema      
    }

    configSchema = {
        type: 'object',
        properties: {
            levels: {type: 'object'},
            level: {type: 'string', default: 'INFO'},
            performanceTime: { type: 'boolean', default: 'true' },
            controllers: this.controllersSchema 
        },
        required: ['controllers'],
        additionalProperties: true
    }
    
    /** Pattern: Singleton */
    constructor(configJSON) {
        debug('constructor')

        if (!Config.instance) {
            if (!this.configure(configJSON))
                throw new Error('Unable to create instance - no validated configuration provided.')
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
    configure(configJSON) {
        debug('configure')
        //debug('configJSON %O', configJSON)

        let newConfig = {}
        if (configJSON !== undefined && typeof configJSON === 'object') {
            newConfig = configJSON
            newConfig.levels = this.#levelsdef
        } else {
            throw new Error('No valid configuration provided.')
        }

        this.#json = this.validate(newConfig)
        if (this.#json === undefined) {
            debug('configuration failed')
            return false
        } else {
            debug('configuration success')
            return true
        }
    }

    /**
     * 
     * @param {object} configJSON 
     * @returns valid config json or undefined
     */
    validate(configJSON) {
        debug('validate')

        let schemaValidator = new Ajv()
        let testSchemaValidator = schemaValidator.compile(this.configSchema)
        let valid = testSchemaValidator(configJSON)
        if (!valid) { 
            debug('validation errors %O', testSchemaValidator.errors)
            console.error('validation errors %O', testSchemaValidator.errors)
            throw new Error('Logish.validate() has failed. See previous validation errors in console.error entry.')
        } 
            
        debug('validation success')

        //const validLevel = this.#levelsdef[configJSON.level.toUpperCase()]
        //debug('validLevel %o', validLevel)

        if (this.#levelsdef[configJSON.level.toUpperCase()] === undefined) {
            throw new Error ('config.level must be "trace", "debug", "info", "warn", "error", or "fatal". A valid log level.')
        }

        return configJSON

    }
}
