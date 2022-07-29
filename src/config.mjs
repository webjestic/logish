
import Debug from 'debug'
const debug = Debug('logish:config')
import Ajv from 'ajv'


/**
 * Responsible for ensuring the integrity of the logish configuration.
 * Creating, updating, validating and reconciliation.
 */
export class Config {

    /** the actual configuration */
    #json = undefined

    /** minimum schema for a controller */
    controlSchema = {
        type: 'object',
        properties: {
            classname: { type: 'string' },
            module : { type: 'string' },
            active: { type: 'boolean', default: 'true' },
        },
        required: ['classname', 'module'],
        additionalProperties: true
    }
    
    /**  */
    controllersSchema = {
        type: 'array',
        items: this.controlSchema      
    }
    
    /** */
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

    /** The default Logish configuration. */
    #configDefault = {
        levels : Object.freeze({ 'TRACE': 0, 'DEBUG': 1, 'INFO': 2, 'WARN': 3, 'ERROR': 4, 'FATAL': 5 }),
        level : 'INFO',
        performanceTime : true,
        controllers : [
            {
                classname: 'ControlConsole',
                module : './controlConsole.mjs',
                active: true,
            },
            {
                classname: 'ControlFile',
                module : './controlFile.mjs',
                active: false
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

        /** Singleton - return the instance if already created */
        if (!Config.instance) Config.instance = this
        return Config.instance 
    }

    get json() { return this.#json }
    set json(value) { this.#validate(value) }


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
        this.#validate(config)
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
    #validate(config) {
        debug('validate')
        debug('config arg: %O', config)

        // apply default configuration if necessary
        if (config === undefined || config === {}) {
            debug ('applying default config %O', this.#configDefault) 
            config = this.#configDefault

        // override and force default levels options
        } else {
            config.levels = this.$configDefault.levels
        }

        // validate config
        try {
            let schemaValidator = new Ajv()
            let testSchemaValidator = schemaValidator.compile(this.configSchema)
            let valid = testSchemaValidator(config)
            if (!valid) { 
                debug('validation errors %O', testSchemaValidator.errors)
                this.#json = undefined
            } else {
                this.#json = config
            }
        } catch (ex) {
            debug('config isValid %O', ex)
            this.#json = undefined
            throw new Error('Error validating config.')
        }
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
        if (typeof controller.classname !== 'string') 
            throw new Error('controller.classname is required but is not typeof string.')
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
