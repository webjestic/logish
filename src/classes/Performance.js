/**
 * 
 */
'use strict'


const { performance } = require('perf_hooks') // https://nodejs.org/api/perf_hooks.html#performancegetentries

/**
 * 
 */
module.exports = class Performance {

    /**
     * 
     */
    constructor() { }

    /**
     * 
     * @param {*} logEntry 
     */
    measure(logEntry) {
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

                if (ms > 1000) s = Math.round( ((ms/1000) % 60) * 100) / 100
                if (ms > 60000) m = Math.round( ((ms/1000/60) % 60 ) )

                let tmeasure = ''
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
