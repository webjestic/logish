'use strict'
/*
*/

const EventEmitter = require('events')
const os = require('os')
// const path = require('path')
const { performance } = require('perf_hooks') // https://nodejs.org/api/perf_hooks.html#performancegetentries
require('util').inspect.defaultOptions.depth = 10

const FileControl = require('./ControlFile')

const resetColor = "\x1b[0m"


/*
*/
module.exports = class LogClass extends EventEmitter {
    log_levels = Object.freeze({ "TRACE": 0, "DEBUG": 1, "INFO": 2, "WARN": 3, "ERROR": 4, "FATAL": 5 })
    log_levelid = -1
    config = {}
    env = {}
    namespace = ""
    hostname = os.hostname()

    /*
    */
    constructor(config, namespace) {
        super()

        if (namespace) this.namespace = namespace 
        else this.namespace = ''
        this.config = config
        this.validateConfig()
        this.setupEnv()
        this.addLevelMethods()
    }

    /*
    */
    validateConfig() {
        if (this.config.log_level)
            this.config.log_level = this.config.log_level.toUpperCase()
    }

    /*
    */
    setupEnv() {
        Object.keys(process.env).forEach(key => {
            if (key.toUpperCase().includes('LOGISH') || key.toUpperCase().includes('DEBUG'))
                this.env[key] = process.env[key];
        });
        
        this.log_levelid = this.log_levels[this.config.log_level]

        let nodeVersion = process.version  // let process.version.match(/^v(\d+\.\d+)/)[1] 
        this.config.nodeVersion = nodeVersion
    }

    /* BUILD: add alias function names info(), error(), debug(), etc,.
    */
    addLevelMethods() {
        Object.keys(this.log_levels).forEach(method => {
             this[method.toLowerCase()] = this.logMethods.bind(this, method.toLowerCase())
        })
    }
      
    /* ENTRY POINT: info(), error(), etc
    */
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

        // if any data has been added to the log event, build 
        // the data object. if a callback function is discovered assign it.
        if (arguments.length > 2) {
            logEntry.data = {}
            for (let i = 2; i <= arguments.length-1; i++) {
                if ((typeof arguments[i]) === 'function') {
                    callback = arguments[i]
                } else {
                    logEntry.data[i-2] = arguments[i]
                }
            }
        }   

        this.log(logEntry)
        if (callback) callback(logEntry)
        return true
    }


    /* PROCESS POINT
    */
    log(logEntry) {
        this.performanceMark(logEntry)
        this.logToConsole(logEntry)
        this.logToFile(logEntry)
        // Raise an event
        this.emit('LogEvent', logEntry)
    }

    /*
    */
    performanceMark(logEntry) {
        if (logEntry.level === 'DEBUG' || logEntry.level === 'TRACE') {
            if (this.config.debugging.log_perf_hooks) {

                // if a performance marker has previously been established, determine
                // which level is in progress and process the performance marker.
                let entries = performance.getEntries()
                if (entries.length > 0) {
                    let traceSet = false 
                    let debugSet = false
                    for (let value of entries) {
                        if (value.name === 'DEBUG') debugSet = true
                        if (value.name === 'TRACE') traceSet = true
                    }

                    // if a previous marker is found, measure the performance, calculate the time
                    // and update the logEntry key
                    if ((logEntry.level === 'DEBUG' && debugSet) || (logEntry.level === 'TRACE' && traceSet)) {
                        let ms = Math.round(performance.measure(logEntry.level, logEntry.level).duration * 100) / 100 
                        let s = 0
                        let m = 0
                        let tmeasure = ''

                        if (ms > 1000) s = Math.round( ((ms/1000) % 60) * 100) / 100
                        if (ms > 60000) m = Math.round( ((ms/1000/60) % 60 ) )

                        if (m>0) tmeasure = `m:${m}:${s}+` 
                        else if (s>0) tmeasure = `s:${s}+`
                        else tmeasure =`ms:${ms}+`

                        logEntry.perf_time = tmeasure
                        performance.clearMarks(logEntry.level)
                        performance.clearMeasures(logEntry.level)
                    }
                }
                performance.mark(logEntry.level)
            }
        }
    }

    /*
    */
    logToConsole(logEntry) {
        const levelColor = this.config.console.colors[logEntry.level.toLowerCase()]

        let perf = ''
        if (logEntry.perf_time != undefined) perf = `| ${logEntry.perf_time}`

        let entry = `${logEntry.namespace} [${logEntry.level}] ${logEntry.message} ${perf}`
        let colorEntry = `${logEntry.namespace} [${levelColor}${logEntry.level}${resetColor}] ${logEntry.message} ${levelColor}${perf}${resetColor}`
   
        logEntry.console = entry

        if (this.config.console.use_colors === true) entry = colorEntry

        if (logEntry.data) console.log(entry, logEntry.data)
        else console.log(entry )
    }

    /*
    */
    logToFile(logEntry) {
        if (!this.config.controllers) return false
        let fileControl = new FileControl()
        let entry = undefined
        for (let controller of this.config.controllers) {
            if ((controller.tofile) && (controller.levels.indexOf(logEntry.level.toLowerCase()) > -1))  {
                //controllers.push(controller)
                let perf = ''
                if (logEntry.perf_time != undefined) perf = `| ${logEntry.perf_time}`
                entry = `${logEntry.timeToString} [${logEntry.level}] ${logEntry.namespace} ${logEntry.hostname} - ${logEntry.message} ${perf}`
                entry += os.EOL
    
                fileControl.appendToFile(controller, entry)
            }
        }
        if (entry !== undefined) logEntry.fileEntry = entry
    }
}

