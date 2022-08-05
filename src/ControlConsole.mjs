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
            fatal: { type: 'string', default: '\x1b[31m' },
            reset: { type: 'string', default: '\x1b[0m' }
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
        this.formatEntry(logEntry)
        this.writeToConsole(logEntry)
        
    }

    /**
     * 
     * @param {*} logEntry 
     */
    writeToConsole(logEntry) {
        debug('writeToConsole')

        if (logEntry.message !== undefined) {

            debug ('logEntry %O', logEntry)
            let entry = this.formatEntry(logEntry)
            debug('entry %O', entry)

            if (logEntry.data) 
                console.log(`${entry} %O`, logEntry.data)
            else 
                console.log(entry )

            logEntry.entries.push( { 'console': entry } )
        } else {
            throw new Error ('No log message. Message is required.')
        }
    }

    /**
     * 
     * @param {*} logEntry 
     */
    formatEntry(logEntry) {
        debug('formatEntry')

        let formatStr = this.json.format

        debug('formatJson %o', this.json.format)
        if (this.json.useColor === true) {
            const levelColor = this.json.colors[logEntry.level.toLowerCase()]
            const resetColor = this.json.colors.reset
            const dimColor = '\x1b[2m'
            const underscore = '\x1b[4m'

            if (logEntry.level !== undefined) formatStr = formatStr.replace('%level', `${levelColor}%level${resetColor}`)
            if (logEntry.performance !== undefined) formatStr = formatStr.replace('%perf', `${levelColor}%perf${resetColor}`)
            if (logEntry.namespace !== undefined) formatStr = formatStr.replace('%namespace', `${underscore}%namespace${resetColor}`)
            if (logEntry.datetime.dateString !== undefined) formatStr = formatStr.replace('%datetime', `${dimColor}%datetime${resetColor}`)
        }
        
        debug('formatStr: %o', formatStr)
        return super.formatEntry(logEntry, formatStr)
    }
    
}