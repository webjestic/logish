
import util from 'util'
import { Controller } from './controller.js'


export class ControlConsole extends Controller {

    #configDefaultScheme = {
        name: 'console',
        classname: 'ControlConsole',
        module : './controlConsole.mjs',
        active: true,
        displayOnlyEnvNamespace: false,
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

    #json = {}

    /**
     * 
     * @param {*} controllerConfig 
     */
    constructor(controllerConfig) {
        super(controllerConfig)
        this.#configure(controllerConfig)            
    }

    get json() { return this.#json }
    set json(value) { this.#json = value}

    getConfig() { return this.#json }
    setConfig(value) { this.#configure(value) }

    /**
     * 
     * @param {*} controllerConfig 
     * @returns 
     */
    #configure(controllerConfig) {

        let result = false
        if (controllerConfig !== undefined && typeof controllerConfig === 'object') {
            if (this.#validate(controllerConfig)) {
                this.#assignConfigValues(controllerConfig)
                result = true
            } else
                throw new Error ('Error validating custom config.')
        } else {
            // completely assign default values to the configuration. overrides the
            // config assignment in the super.constructor
            this.json = this.#configDefaultScheme
            result = true
        }

        return result
    }


    /**
     * 
     * @param {*} controllerConfig 
     */
    #validate(controllerConfig) {

        // controllerConfig is validated to be typeof object by this.configure at this point

        // if property exists, the validate the type of the property
        if (controllerConfig.active !== undefined 
            && typeof controllerConfig.active !==  'boolean')
            throw new Error ('Provided controller.active is not typeof "boolean".')

        if (controllerConfig.displayLevels !== undefined 
            && typeof controllerConfig.displayLevels === 'object') {
            if (!Array.isArray(controllerConfig.displayLevels)) 
                throw new Error ('Provided controller.displayLevels is not of typeof "array".')
        }

        if (controllerConfig.format !== undefined 
            && typeof controllerConfig.format !== 'string') 
            throw new Error ('Provided controller.format is not typeof "string".')

        if (controllerConfig.useColor !== undefined 
            && typeof controllerConfig.useColor !== 'boolean') 
            throw new Error ('Provided controller.useColor is not typeof "boolean".')

        if (controllerConfig.displayOnlyEnvNamespace !== undefined 
            && typeof controllerConfig.displayOnlyEnvNamespace !== 'boolean') 
            throw new Error ('Provided controller.displayOnlyEnvNamespace is not typeof "boolean".')

        if (controllerConfig.colors !== undefined 
            && typeof controllerConfig.colors !== 'object') 
            throw new Error ('Provided controller.colors is not of typeof "object".')

        return true
    }

    /**
     * 
     * @param {*} controllerConfig 
     */
    #assignConfigValues(controllerConfig) {

        // if property exists then assign the value - otherwise assign the default value
        if (controllerConfig.name !== undefined) 
            this.#json.name = controllerConfig.name
        else 
            this.#json.name = this.#configDefaultScheme.name

        if (controllerConfig.active !== undefined) 
            this.#json.active = controllerConfig.active
        else 
            this.#json.active = this.#configDefaultScheme.active

        if (controllerConfig.displayLevels !== undefined) 
            this.#json.displayLevels = controllerConfig.displayLevels
        else 
            this.#json.displayLevels = this.#configDefaultScheme.displayLevels

        if (controllerConfig.format !== undefined) 
            this.#json.format = controllerConfig.format
        else 
            this.#json.format = this.#configDefaultScheme.format
        
        if (controllerConfig.useColor !== undefined) 
            this.#json.useColor = controllerConfig.useColor
        else 
            this.#json.useColor = this.#configDefaultScheme.useColor

        if (controllerConfig.displayOnlyEnvNamespace !== undefined) 
            this.#json.displayOnlyEnvNamespace = controllerConfig.displayOnlyEnvNamespace
        else 
            this.#json.displayOnlyEnvNamespace = this.#configDefaultScheme.displayOnlyEnvNamespace

        if (controllerConfig.colors !== undefined) 
            this.#json.colors = controllerConfig.colors
        else 
            this.#json.colors = this.#configDefaultScheme.colors
    }
        

    /**
     * 
     * @param {object} logEntry 
     */
    entry(logEntry) {

        // if log level is configured for display
        if (this.json.displayLevels.indexOf(logEntry.level) <= -1) return false 
        if (this.json.displayOnlyEnvNamespace && !this.#canDisplayEnvNamespace(logEntry))  return false


        
        super.entry(logEntry)
        //this.formatEntry(logEntry)
        this.writeToConsole(logEntry)
        return true
    }

    /**
     * 
     * @returns boolean - If namespace is restricted (meaning this namespace should not be displayed
     *                      under these coniditions) it returns true
     */
    #canDisplayEnvNamespace(logEntry) {
        // this.json.displayOnlyEnvNamespace
        let result = false

        if (logEntry.envVars !== undefined && logEntry.namespace !== undefined) {
            if (this.json.displayOnlyEnvNamespace === true) {

                // if logEntry.namespace is NOT found in logEntry.envVars,
                // then restrict it by assigning TRUE
                const namespaceWildcard = logEntry.namespace.substring(0, logEntry.namespace.indexOf(':')+1) + '*'
                if (logEntry.envVars.indexOf(logEntry.namespace) > -1 
                || logEntry.envVars.indexOf(namespaceWildcard) > -1) 
                    result = true
            }
        }
        return result
    }

    /**
     * 
     * @param {*} logEntry 
     */
    writeToConsole(logEntry) {

        if (logEntry.message !== undefined) {

            let entry = this.formatEntry(logEntry)

            if (logEntry.data) {
                // require('util').inspect.defaultOptions.depth = 10
                // util.inspect(object, showHidden=false, depth=2, colorize=true)
                // https://nodejs.org/en/knowledge/getting-started/how-to-use-util-inspect/
                //console.log(`${entry} data: %O`, util.inspect(logEntry.data, false, 10, false))
                console.log(`${entry} data: `, util.inspect(logEntry.data, false, 10, true))
            } else
                console.log(entry )

            // logEntry.entries.push( { 'console': entry } )
        } else
            throw new Error ('No log message. Message is required.')
    }

    /**
     * 
     * @param {*} logEntry 
     */
    formatEntry(logEntry) {

        
        let returnEntry = super.formatEntry(logEntry, this.json.format)
        logEntry.entries.push( { 'console': returnEntry } )

        if (this.json.useColor === true) {

            let formatStr = this.json.format
            const levelColor = this.json.colors[logEntry.level.toLowerCase()]
            const resetColor = this.json.colors.reset
            const dimColor = '\x1b[2m'
            const underscore = '\x1b[4m'

            if (logEntry.level !== undefined) 
                formatStr = formatStr.replace('%level', `${levelColor}%level${resetColor}`)
            if (logEntry.performance !== undefined) 
                formatStr = formatStr.replace('%performance', `${levelColor}%performance${resetColor}`)
            if (logEntry.namespace !== undefined) 
                formatStr = formatStr.replace('%namespace', `${underscore}%namespace${resetColor}`)
            if (logEntry.datetime.dateString !== undefined) 
                formatStr = formatStr.replace('%datetime', `${dimColor}%datetime${resetColor}`)

            returnEntry = super.formatEntry(logEntry, formatStr)
        }

        return returnEntry
    }
    
}