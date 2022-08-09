
import Debug from 'debug'
const debug = Debug('logish:class')
import { EventEmitter } from 'events'
import { Config } from './ConfigX.mjs'
import { LogEntry } from './LogEntry.mjs'
import { ControlHandler } from './ControlHandler.mjs'

import { performance } from 'perf_hooks' // https://nodejs.org/api/perf_hooks.html#performancegetentries

export class Logish extends EventEmitter {

    #config = undefined
    #env = undefined
    #controlHandler = undefined
    #namespace = undefined

    /** Pattern:  */
    constructor(configJSON) {
        super()
        debug('constructor')
        
        this.#config = new Config( configJSON) 
        
        this.#setup()
    }

    /**
     * 
     * @returns 
     */
    getConfig() { return this.#config.getConfig() }
    getLevels() { return this.#config.getLevels() }

    getNamespace() { return this.#namespace }
    setNamespace(value) { this.#namespace = value }

    /**
     * 
     */
    #setup() {
        debug('setup')
        this.#setupControls()
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
        entry.namespace = this.#namespace

        // pass the log entry to the controllers for porcessing and run the callback
        //debug('entry %O', entry)
        
        var logEntry = new LogEntry(entry)
        //debug('logEntry.json %O', logEntry.json)
        this.#controlHandler.entry(logEntry.json)
        
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

    showStats() {
        this.#controlHandler.showStats()
    }
}
