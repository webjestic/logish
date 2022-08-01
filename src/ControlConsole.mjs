import Debug from 'debug'
const debug = Debug('logish:console')
import { Controller } from './controller.mjs'
import Ajv from 'ajv'


export class ControlConsole extends Controller {


    colorSchema = {
        type: 'object',
        properties: {
            trace : { type: 'string', default: '\x1b[32m' },
            debug: { type: 'string', default: '\x1b[36m' },
            info : { type: 'string', default: '\x1b[37m' },
            warn: { type: 'string', default: '\x1b[33m' },
            error : { type: 'string', default: '\x1b[35m' },
            fatal: { type: 'string', default: '\x1b[31m' }
        },
        additionalProperties: false
    }

    configSchema = {
        type: 'object',
        properties: {
            name : { type: 'string' },
            classname: { type: 'string' },
            module : { type: 'string' },
            active: { type: 'boolean', default: 'true' },

            displayLevels: { type: 'array', default: ['trace', 'debug', 'info', 'warn', 'error', 'fatal'] },
            format : { type: 'string', default :'[%date] [%level] %entry %perf' },
            useColors: {type: 'boolean', default: true },
            colors: this.colorSchema
        },
        required: ['classname', 'module'],
        additionalProperties: true
    }

    constructor(controllerConfig) {
        super(controllerConfig)
        debug('constructor')

        this.#validate()
    }


    /**
     * 
     */
    #validate() {
        debug('validateConfig')
        let confg = this.json

        let schemaValidator = new Ajv()
        let testSchemaValidator = schemaValidator.compile(this.configSchema)
        let valid = testSchemaValidator(confg)
        if (!valid) { 
            debug('validation errors %O', testSchemaValidator.errors)
            console.error('validation errors %O', testSchemaValidator.errors)
            throw new Error('Control.validate() has failed. See previous validation errors in console.error entry.')
        }
    }
        

    /**
     * 
     * @param {object} logEntry 
     */
    entry(logEntry) {
        super.entry()
        debug('entry')

        if (!this.#canLogNamespaceEntry(logEntry)) return false
        
    }

    /**
     * 
     * @param {object} logEntry 
     * @returns boolean
     */
    #canLogNamespaceEntry(logEntry) {
        debug('canLogNamespaceEntry')
        //debug('namespace %o', logEntry.namespace)
        //debug('envVars %o', logEntry.envVars)
        //debug('envVars.LOGISH %o', logEntry.envVars.LOGISH)

        let useNamespaceRules = false
        let canLogEntry = false
        if (logEntry.envVars !== undefined && logEntry.namespace !== undefined) {
            //debug('checking namespace rules')
            if (logEntry.envVars.LOGISH === undefined) 
                throw new Error('Environment varialbes, but undefined LOGISH env var.')
            useNamespaceRules = true
            let envArray = logEntry.envVars.LOGISH.split(',')

            // if namespace is found as an environment variable 
            if (envArray.indexOf(logEntry.namespace) > -1) {
                //debug('namespace found in env')
                canLogEntry = true
            } else {
                // if namespace is found in an environment variable with wildcard
                let charPos = logEntry.namespace.indexOf(':')
                if (logEntry.namespace.indexOf(':') > -1) {
                    let namespaceAlt = logEntry.namespace.substring(0, charPos+1) + '*'
                    if (envArray.indexOf(namespaceAlt) > -1) {
                        //debug('namespaceAlt found in env %o', namespaceAlt)
                        canLogEntry = true
                    }
                }
            }
            
        }

        if (useNamespaceRules && canLogEntry) {
            debug('logging with namespace rules')
            return true
        } else {
            debug('skipping because of namespace rules')
            return false
        }

    }
    
}