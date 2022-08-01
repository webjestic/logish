
import Debug from 'debug'
const debug = Debug('logish:class')
import { EventEmitter } from 'events'
import { Config } from './Config.mjs'
import { LogEntry } from './LogEntry.mjs'
import { ControlHandler } from './ControlHandler.mjs'

import { performance } from 'perf_hooks' // https://nodejs.org/api/perf_hooks.html#performancegetentries

export class Logish extends EventEmitter {

    #namespace = undefined
    #config = undefined
    #env = undefined
    #controlHandler = undefined

    /** Pattern:  */
    constructor(configJSON, namespace) {
        super()
        debug('constructor')
        
        this.#config = new Config( this.#resolveConstructorArgs(configJSON, namespace) )
        
        this.#setup()
    }

    /**
     * 
     * @returns 
     */
    getConfig() { return this.#config.getConfig() }
    getLevels() { return this.#config.getLevels() }

    /**
     * Method validates constructor arguments and resolves accordingly.
     * 
     * @access Protected
     * @param {object} config - Custom configuration json object for Logish.
     * @param {string} namespace - Used to filter debug and trace log entries for verbose.
     * @returns {object} - Returns a acceptable config object for the Config instance.
     */
    #resolveConstructorArgs(config, namespace) {
        debug('resolveConstructorArgs')

        // probably is: new Logish('MyNamespace')
        if (typeof config === 'string' && typeof namespace === 'undefined') {
            debug('Preparing for DEFAULT config and a DEFINED namespace.')
            this.#namespace = config
            return undefined
        }

        // probably is: new Logish()
        if (typeof config === 'undefined' && typeof namespace === 'undefined') {
            debug('Preparing for DEFAULT config and NO namespace.')
            this.#namespace = undefined
            return undefined
        }

        // probably is: new Logish(configJSON)
        if (typeof config === 'object' && typeof namespace === 'undefined') {
            if (!Array.isArray(config)) {
                debug('Preparing for CUSTOM config and NO namespace.')
                this.#namespace = undefined
                return config
            } else {
                throw new Error('Invalid new Logish() config argument. Cannot be of type Array.')
            }
        }

        // probably is: new Logish(configJSON, 'MyNamespace')
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
     * 
     */
    #setup() {
        debug('setup')
        this.#setupControls()
        this.#setupEnv()
        this.#setupLevelMethods()
    }

    /**
     * 
     */
    #setupControls() {
        debug('setupControls')
        this.#controlHandler = new ControlHandler(this.#config.json.controllers)
    }

    /**
     * Method reads values for LOGISH environment variables.
     * 
     * @access Protected
     */
    #setupEnv() {
        debug('setupEnv')
        Object.keys(process.env).forEach(key => {
            if (key.toUpperCase().includes('LOGISH')) {
                if (this.#env === undefined) this.#env = {}
                this.#env[key] = process.env[key]
            }
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
            this[method.toLowerCase()] = this.entry.bind(this, method.toLowerCase())
        })
    }


    /**
     * Method used to add log entries for all log levels. 'log' defaults to 'info'.
     * 
     * @access Public
     * @param {any} args 
     */
    entry(...args) {
        debug('entry')
        debug('entry args %O', args)
        //debug('entry arguments %O', arguments)

        // terminte the process if a valid log level is not being used.
        if (this.#config.json.levels[args[0].toUpperCase()] === undefined)
            throw new Error('Invalid log level method alias used. Try info(), debug(), or any valid log level.')
        if (!this.#allowLevelEntry(args[0])) return false

        // build the logEntry object based on all entry arguments
        let callback = undefined
        let dataIndex = 0
        let entry = { 
            level: args[0],
            namespace : this.#namespace,
            message: args[1] 

        }
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

        entry.envVars = this.#env
        entry.performance = this.#trackPerformance(entry)

        // pass the log entry to the controllers for porcessing and run the callback
        //debug('entry %O', entry)
        
        var logEntry = new LogEntry(entry)
        //debug('logEntry.json %O', logEntry.json)
        this.#controlHandler.entry(entry)
        
        if (callback) callback(logEntry.json)

        // Raise a Log Event. Created on every log entry. 
        this.emit('LogEvent', logEntry.json)
        
        return true
    }

    /**
     * Determine if the log level attempt is allowed - if it is an actual registered level.
     * 
     * @access Protected
     * @param {string} level 
     * @returns true if log entry level is less-than-equal-to the logish config.level.
     */
    #allowLevelEntry(level) {
        debug('allowLevelEntry')

        //debug('Config Levels:', this.#config.json.levels)
        //debug('Defined Level:', this.#config.json.level)
        //debug('Defined Level ID:', this.#config.json.levels[this.#config.json.level.toUpperCase()])
        //debug('Logging Level ID:', this.#config.json.levels[level.toUpperCase()])

        return (this.#config.json.levels[level.toUpperCase()] >= this.#config.json.levels[this.#config.json.level.toUpperCase()])
    }


    /**
     * 
     * @param {*} entry 
     * @returns 
     */
    #trackPerformance(entry) {
        debug('trackPerformance')
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
        debug('performance %o', result)
        return result
    }

}
