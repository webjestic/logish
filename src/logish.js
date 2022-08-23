

import { EventEmitter } from 'events'
import { Config } from './config.js'
import { LogEntry } from './log_entry.js'
import { ControlHandler } from './control_handler.js'

import { performance } from 'perf_hooks' // https://nodejs.org/api/perf_hooks.html#performancegetentries

/**
 * Responsible for setting up an operational environment, for log entries to flow through. 
 * Entires are to be routed to controllers.
 */
export class Logish extends EventEmitter {

    /** Instance of the Config class. Singleton. */
    #config = undefined

    /** Array of LOGISH environment variables. */
    #env = undefined

    /** Instance of the ControlHandler class. Singleton. */
    #controlHandler = undefined

    /** Namespace of the Logish instance. */
    #namespace = undefined

    /** Use Functions */
    #useFunctions = []

    /**
     * Class Constructor. Responsible for setting up a proper Logish instance.
     * 
     * @access Public
     * 
     * @param {object} configJSON - Optional. If not passed, default values are used.
     */
    constructor(configJSON) {
        super()
        
        this.#config = new Config(configJSON) 
        this.#setup()
    }


    /** Get the current namespace for the instance. */
    getNamespace() { return this.#namespace }
    /** Set the namespace for the instance. */
    setNamespace(value) { this.#namespace = value }
    /** Get the current log level */
    getLevel() { return this.#config.getLevel() }
    /** Set the current log level */
    setLevel(value) { 
        this.#config.setLevel(value) 
    }
    /** */
    getConfig() { 
        return this.#config.getConfig() 
    }
    /** */
    setConfig(value) { 
        this.#config.setConfig(value) 
        this.#setupControllers()
    }

    /**
     * Responsible for executing all setup methods for creating a proper instance.
     * 
     * @access Protected
     */
    #setup() {
        this.#setupEnv()
        this.#setupControllers()
        this.#setupLevelMethods()
    }

    /**
     * Creates the controller handling instance. Required for actual output.
     * 
     * @access Protected
     */
    #setupControllers() {
        this.#controlHandler = new ControlHandler(this.#config.json.controllers)
        this.#updateConfgWithControllersConfig()
    }

    /**
     * 
     */
    #updateConfgWithControllersConfig() {
        //console.log ('CONTROLLERS', this.#controlHandler.controllers)
        this.#config.json.controllers = []
        for (let controller of this.#controlHandler.controllers) {
            //console.log ('CONTROL', controller.getConfig())
            this.#config.json.controllers.push(controller.getConfig())
        }

    }

    /**
     * Method creates the alias names for the log method. info(), warn(), debug(), etc,.
     * 
     * @access Protected
     */
    #setupLevelMethods() {
        const levels = this.#config.json.levels
        Object.keys(levels).forEach(method => {
            this[method.toLowerCase()] = this.entry.bind(this, method.toLowerCase())
        })
    }


    /**
     * Method used to add log entries for all log levels. Alias methods are trace(), debug(), etc.
     * 
     * Entry point for all log entires. This is a multi-responsibility method:
     * - Responsible for determining if log entry is valid and able to be ran
     * - Responsible for building out arguments
     * - Responsible for executing controller handler
     * - Responsible for triggering the LogEvent
     * - Responsible for running any callback code
     * 
     * @access Public
     * @param {any} args 
     * 
     * @returns {boolean} true if ran, false if not ran
     */
    entry(...args) {


        // terminte the process if a valid log level is not being used.
        if (this.#config.json.levels[args[0].toUpperCase()] === undefined)
            throw new Error('Invalid log level method alias used. Try info(), debug(), or any valid log level.')
        if (!this.#allowLevelEntry(args[0])) 
            return false
        

        // build the logEntry object based on all entry arguments
        let callback = undefined
        let dataIndex = 0
        let entry = { 
            level: args[0],
            message : ''
            //message: args[1]
        }
        /*
        if (arguments.length > 2) {
            for (let i = 2; i <= arguments.length-1; i++) {
                switch (typeof arguments[i]) {
                case 'function' : 
                    callback = arguments[i]
                    break
                case 'object' : 
                    if (Array.isArray(arguments[i]))
                        entry.message += ' [ ' + arguments[i] + ' ]'
                    else {
                        if (entry.data === undefined) entry.data = {}
                        entry.data[dataIndex] = arguments[i]
                        dataIndex++
                    }
                    break
                default :
                    entry.message += ' ' + arguments[i]
                }
            }
        }
        v1.0.4
        */
        for (let i = 1; i <= arguments.length-1; i++) {
            switch (typeof arguments[i]) {
            case 'function' : 
                callback = arguments[i]
                break
            case 'object' : 
                if (Array.isArray(arguments[i]))
                    entry.message += ' [ ' + arguments[i] + ' ]'
                else {
                    if (entry.data === undefined) entry.data = {}
                    entry.data[dataIndex] = arguments[i]
                    dataIndex += dataIndex
                }
                break
            default :
                entry.message += ' ' + arguments[i]
            }
        }

        entry.envVars = this.#env
        entry.performance = this.#trackPerformance(entry)
        entry.namespace = this.#namespace

        // pass the log entry to the controllers for porcessing and run the callback
        var logEntry = new LogEntry(entry)
        //debug('logEntry.json %O', logEntry.json)
        this.#controlHandler.entry(logEntry.json)

        // execute the 
        if (this.#useFunctions.length > 0) {
            for (let func of this.#useFunctions) 
                func(logEntry.json)
        }
        
        if (callback) callback(logEntry.json)

        // Raise a Log Event. Created on every log entry. 
        this.emit('LogEvent', logEntry.json)
        
        return true
    }

    /**
     * Responsible for parsing out the PROCESS ENV information and storing it as an array.
     */
    #setupEnv() {
        let lenv = undefined
        Object.keys(process.env).forEach(key => {
            if (key.toUpperCase().includes('LOGISH'))
                lenv = process.env[key]
        })

        if (lenv !== undefined) this.#env = lenv.split(',')
    }

    /**
     * Determine if the log level attempt is allowed - if it is an actual registered level.
     * 
     * @access Protected
     * @param {string} level 
     * 
     * @returns true if log entry level is less-than-equal-to the logish config.level.
     */
    #allowLevelEntry(level) {

        const result = 
            (this.#config.json.levels[level.toUpperCase()] 
            >= this.#config.json.levels[this.#config.json.level.toUpperCase()])

        return result
    }


    /**
     * Tracks performance for each of the log levels (info, debug, warn, etc,.)
     * 
     * @param {String} entry 
     * 
     * @returns {String} Returns value of performance ( 0.10ms), or undefined.
     */
    #trackPerformance(entry) {
        let result = undefined
        if (this.#config.json.performanceTime !== undefined && this.#config.json.performanceTime === true) {

            // if a performance markers exist
            let entries = performance.getEntries()
            if (entries.length > 0) {

                // check for matching log-level performance marker and flag it
                let logLevelFound = false
                for (let value of entries) { 
                    if (value.name === entry.level) {
                        logLevelFound = true
                        break
                    }
                }

                // if a previous marker is flagged, measure the performance, calculate the time
                // and update the performance key
                if (logLevelFound === true) {
                    let ms = Math.round(performance.measure(entry.level, entry.level).duration * 100) / 100 
                    let s = 0
                    let m = 0

                    if (ms > 1000) s = Math.round( ((ms/1000) % 60) * 100) / 100
                    if (ms > 60000) m = Math.round( ((ms/1000/60) % 60 ) )

                    let tmeasure = ''
                    if (m>0) tmeasure = `${m}:${s}(m)` 
                    else if (s>0) tmeasure = `${s}(s)`
                    else tmeasure =`${ms}(ms)`

                    result = tmeasure
                    performance.clearMarks(entry.level)
                    performance.clearMeasures(entry.level)
                }
            }
            performance.mark(entry.level)
        }
        return result
    }

    /**
     * Shows the statistics for the running instance, from all controllers.
     */
    showStats() {
        return this.#controlHandler.showStats()
    }

    /**
     * 
     * 
     * @param {function} func 
     */
    use(func) {
        if (func !== undefined) {
            if (typeof func === 'function')
                this.#useFunctions.push(func)
            else
                throw new Error ('Logish.use : argument needs to be typeof "function".')
        } else
            throw new Error ('Logish.use : argument cannot be undefinied.')
    }
}
