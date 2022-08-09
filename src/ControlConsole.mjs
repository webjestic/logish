import Debug from 'debug'
import util from 'util'
const debug = Debug('logish:console')
import { Controller } from './Controller.mjs'


export class ControlConsole extends Controller {

    #configDefaultScheme = {
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
    }

    /**
     * 
     * @param {*} controllerConfig 
     */
    constructor(controllerConfig) {
        super(controllerConfig)
        debug('constructor')

        this.configure(controllerConfig)
            
    }

    /**
     * 
     * @param {*} controllerConfig 
     * @returns 
     */
    configure(controllerConfig) {

        let result = false
        if (controllerConfig !== undefined && typeof controllerConfig === 'object') {
            if (this.validate(controllerConfig)) {
                this.#assignConfigValues(controllerConfig)
                result = true
            } else {
                throw new Error ('Error validating custom config.')
            }
        } else {
            // completely assign default values to the configuration. overrides the
            // config assignment in the super.constructor
            this.json = this.#configDefaultScheme
            result = true
        }

        debug('console config: %O', this.json)
        return result
    }


    /**
     * 
     * @param {*} controllerConfig 
     */
    validate(controllerConfig) {
        debug('validate')

        // controllerConfig is validated to be typeof object by this.configure at this point

        // if property exists, the validate the type of the property
        if (controllerConfig.active !== undefined && typeof controllerConfig.active !==  'boolean')
            throw new Error ('Provided controller.active is not typeof "boolean".')

        debug('active')
        if (controllerConfig.displayLevels !== undefined && typeof controllerConfig.displayLevels === 'object') {
            debug('displayLevels')
            if (!Array.isArray(controllerConfig.displayLevels)) {
                debug('displayLevels not array')
                throw new Error ('Provided controller.displayLevels is not of typeof "array".')
            }
        }

        debug('format')
        if (controllerConfig.format !== undefined && typeof controllerConfig.format !== 'string') 
            throw new Error ('Provided controller.format is not typeof "string".')

        debug('useColor')
        if (controllerConfig.useColor !== undefined && typeof controllerConfig.useColor !== 'boolean') 
            throw new Error ('Provided controller.useColor is not typeof "boolean".')

        debug('colors')
        if (controllerConfig.colors !== undefined && typeof controllerConfig.colors !== 'object') 
            throw new Error ('Provided controller.colors is not of typeof "object".')
            

        debug('end validate')
        return true
    }

    /**
     * 
     * @param {*} controllerConfig 
     */
    #assignConfigValues(controllerConfig) {
        debug('assignConfigValues')

        // if property exists then assign the value - otherwise assign the default value
        if (controllerConfig.active !== undefined) this.json.active = controllerConfig.active
        else this.json.active = this.#configDefaultScheme.active

        if (controllerConfig.displayLevels !== undefined) this.json.displayLevels = controllerConfig.displayLevels
        else this.json.displayLevels = this.#configDefaultScheme.displayLevels

        if (controllerConfig.format !== undefined) this.json.format = controllerConfig.format
        else this.json.format = this.#configDefaultScheme.format
        
        if (controllerConfig.useColor !== undefined) this.json.useColor = controllerConfig.useColor
        else this.json.useColor = this.#configDefaultScheme.useColor

        if (controllerConfig.colors !== undefined) this.json.colors = controllerConfig.colors
        else this.json.colors = this.#configDefaultScheme.colors
    }
        

    /**
     * 
     * @param {object} logEntry 
     */
    entry(logEntry) {
        debug('entry')

        // if log level is intended to be dispalyed to console
        if (this.json.displayLevels.indexOf(logEntry.level) > -1) {
            super.entry(logEntry)
            this.formatEntry(logEntry)
            this.writeToConsole(logEntry)
        }
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

            if (logEntry.data) {
                // require('util').inspect.defaultOptions.depth = 10
                // util.inspect(object, showHidden=false, depth=2, colorize=true)
                // https://nodejs.org/en/knowledge/getting-started/how-to-use-util-inspect/
                console.log(`${entry} %O`, util.inspect(logEntry.data, false, 10, this.json.useColor))
            } else { 
                console.log(entry )
            }

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
            if (logEntry.performance !== undefined) formatStr = formatStr.replace('%performance', `${levelColor}%performance${resetColor}`)
            if (logEntry.namespace !== undefined) formatStr = formatStr.replace('%namespace', `${underscore}%namespace${resetColor}`)
            if (logEntry.datetime.dateString !== undefined) formatStr = formatStr.replace('%datetime', `${dimColor}%datetime${resetColor}`)
        }
        
        debug('formatStr: %o', formatStr)
        return super.formatEntry(logEntry, formatStr)
    }
    
}