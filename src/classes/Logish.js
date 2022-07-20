/**
 * 
 */


const EventEmitter = require('events')
const os = require('os')
require('util').inspect.defaultOptions.depth = 10

const FileControl = require('./ControlFile')
const ConsoleControl = require('./ControlConsole')
const Performance = require('./Performance')
const LogConfig = require('./LogConfig')


/**
 * 
 * TODO: revist returns
 */
module.exports = class Logish extends EventEmitter {

    #performance = undefined
    #consoleControl = undefined
    #fileControl = undefined

    /**
     * 
     * @param {object} config 
     * @param {string} namespace 
     */
    constructor(config, namespace) {
        super()

        if (namespace) this.namespace = namespace 
        else this.namespace = ''

        this.log_levels = Object.freeze({ 'TRACE': 0, 'DEBUG': 1, 'INFO': 2, 'WARN': 3, 'ERROR': 4, 'FATAL': 5 })
        this.hostname = os.hostname()
        this.log_levelid = -1

        let configuration = new LogConfig(config)
        this.config = configuration.get()
        this.#setupEnv()
        this.#addLevelMethods()

        this.#performance = new Performance()
        this.#consoleControl = new ConsoleControl()
        this.#fileControl = new FileControl()
    }


    /**
     * 
     */
    #setupEnv() {
        this.env = {}
        Object.keys(process.env).forEach(key => {
            if (key.toUpperCase().includes('LOGISH') || key.toUpperCase().includes('DEBUG'))
                this.env[key] = process.env[key]
        })
        
        this.log_levelid = this.log_levels[this.config.log_level]

        let nodeVersion = process.version  // let process.version.match(/^v(\d+\.\d+)/)[1] 
        this.config.nodeVersion = nodeVersion
    }


    /**
     * BUILD: add alias function names info(), error(), debug(), etc,.
     */
    #addLevelMethods() {
        Object.keys(this.log_levels).forEach(method => {
            this[method.toLowerCase()] = this.logMethods.bind(this, method.toLowerCase())
        })
    }
      

    /**
     * ENTRY POINT: info(), error(), etc
     * 
     * @param  {...any} args 
     */
    // eslint-disable-next-line no-unused-vars
    logMethods(...args) {

        // exit if the log level attempt less than the confugured log level.
        const levelid = this.log_levels[arguments[0].toUpperCase()]
        if (levelid < this.log_levelid) return false

        // if debug() or trace() and log only namespace entries is true
        // check to see if the namespace matches a defined env namespace
        // scenario: DEBUG=express and require('logish')(config, 'express')
        if ((levelid <= 1) && (this.config.debugging.log_only_namespace))
            if ( (this.env['DEBUG'].split(',')).indexOf(this.namespace) === -1) return false

        const dtime = Date.now()
        var callback = undefined

        // build the JSON log event
        var logEntry = {}
        logEntry.level = arguments[0].toUpperCase()
        logEntry.levelid = levelid
        logEntry.hostname = this.hostname
        logEntry.namespace = this.namespace
        logEntry.message = arguments[1]
        logEntry.timestamp = Date.now()
        logEntry.timeToString = (new Date(dtime).toISOString())
        logEntry.perf_time = undefined
        logEntry.console = undefined
        logEntry.fileEntry = undefined

        // if any objects has been added to the log event, build the data object.
        // update the logEntry.message with any non-object items
        // if a callback function is discovered assign it.
        let dataIndex = 0
        if (arguments.length > 2) {
            for (let i = 2; i <= arguments.length-1; i++) {
                switch (typeof arguments[i]) {
                case 'function' : 
                    callback = arguments[i]
                    break
                case 'object' : 
                    if (Array.isArray(arguments[i]))
                        logEntry.message += ' [ ' + arguments[i] + ' ]'
                    else {
                        if (logEntry.data === undefined) logEntry.data = {}
                        logEntry.data[dataIndex] = arguments[i]
                        dataIndex++
                    }
                    break
                default :
                    logEntry.message += ' ' + arguments[i]
                }
            }
        }   
        this.#log(logEntry)
        if (callback) callback(logEntry)
    }

    /**
     * The process point.
     * 
     * @param {object} logEntry 
     */
    #log(logEntry) {
        this.#performanceMark(logEntry)
        this.#logToConsole(logEntry)
        this.#logToFile(logEntry)
        this.emit('LogEvent', logEntry) // Raise an event
    }

    /**
     * 
     * @param {object} logEntry 
     */
    #performanceMark(logEntry) {
        if (logEntry.level === 'DEBUG' || logEntry.level === 'TRACE') {
            if (this.config.debugging.log_perf_hooks) {
                this.#performance.measure(logEntry)
            }
        }
    }

    /**
     * 
     * @param {object} logEntry 
     * @returns 
     */
    #logToConsole(logEntry) {
        if (this.config.console.display_levels.indexOf(logEntry.level.toLowerCase()) < 0) return false

        
        this.#consoleControl.appendToConsole(this.config.console, logEntry)
    }

    /**
     * 
     * @param {object} logEntry 
     * @returns 
     */
    #logToFile(logEntry) {
        if (!this.config.file_controllers) return false

        // if a file_controller exists, log tofile is true, and the level being logged 
        // is part of the controller, then attemtp to log to file. file_controllers are
        // not required and therefore, may not exist in the config.
        if (this.config.file_controllers) {
            try {
                for (let controller of this.config.file_controllers) {
                    if ((controller.tofile) && (controller.levels.indexOf(logEntry.level.toLowerCase()) > -1))
                        this.#fileControl.appendToFile(controller, logEntry)
                }
            } catch (e) {
                console.log(e)
            }
        }
    }
}
