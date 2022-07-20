/**
 * 
 */


/**
 * 
 */
module.exports = class ConsoleControl {

    /**
     * 
     */
    constructor() {

    }

    /**
     * 
     * @param {*} consoleOptions 
     * @param {*} logEntry 
     */
    appendToConsole(consoleOptions, logEntry) {
        const resetColor = '\x1b[0m'
        const levelColor = consoleOptions.colors[logEntry.level.toLowerCase()]

        if (logEntry.message !== undefined) {

            let perf = ''
            if (logEntry.perf_time != undefined) perf = `${logEntry.perf_time}`

            let entry = `${logEntry.namespace} [${logEntry.level}] ${logEntry.message} ${perf}`
            let colorEntry = `${logEntry.namespace} [${levelColor}${logEntry.level}${resetColor}] ${logEntry.message} ${levelColor}${perf}${resetColor}`

            if (consoleOptions.use_colors === true) entry = colorEntry

            if (logEntry.data) console.log(entry, logEntry.data)
            else console.log(entry )

            logEntry.console = entry
        } else {
            throw new Error ('No log message. Message is required.')
        }
    }
}