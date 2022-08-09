import Debug from 'debug'

const debug = Debug('logish:controller')



/**
 * 
 * 
 */
export class Controller {

    /** Coniguration specific only to the controller */
    #json
    #stats = {
        total : 0,
        trace: 0,
        debug: 0,
        info: 0,
        warn: 0,
        error: 0,
        fatal: 0
    }

    /**
     * 
     * @param {*} controllerConfig 
     */
    constructor(controllerConfig) {
        debug('constructor')
        this.#json = controllerConfig
    }

    get json() { return this.#json }
    set json(value) { this.#json = value}
    get stats() { return this.#stats }

    /**
     * 
     * @param {object} logEntry 
     */
    entry(logEntry) {
        debug('entry')
        this.#stats.total = this.#stats.total + 1
        switch (logEntry.level.toLowerCase()) {
        case 'trace': 
            this.#stats.trace = this.#stats.trace + 1
            break
        case 'debug' :
            this.#stats.debug = this.#stats.debug + 1
            break
        case 'info' :
            this.#stats.info = this.#stats.info + 1
            break
        case 'warn' :
            this.#stats.warn = this.#stats.warn + 1
            break
        case 'error' : 
            this.#stats.error = this.#stats.error + 1
            break
        case 'fatal' :
            this.#stats.fatal = this.#stats.fatal + 1
            break
        default : break
        }
    }

    /**
     * 
     * @param {*} logEntry 
     * @param {*} formatStr 
     * @returns 
     */
    formatEntry(logEntry, formatStr) {
        debug('formatEntry')
        
        if (logEntry.datetime.dateString !== undefined) formatStr = formatStr.replace('%datetime', logEntry.datetime.dateString)
        else formatStr = formatStr.replace('%datetime', '')

        if (logEntry.namespace !== undefined) formatStr = formatStr.replace('%namespace', logEntry.namespace)
        else formatStr = formatStr.replace('%namespace', '')

        if (logEntry.level !== undefined) formatStr = formatStr.replace('%level', logEntry.level.toUpperCase().padEnd(5, ' '))
        else formatStr = formatStr.replace('%level', '')

        if (logEntry.hostname !== undefined) formatStr = formatStr.replace('%host', logEntry.hostname)
        else formatStr = formatStr.replace('%host', '')
        
        if (logEntry.message !== undefined) formatStr = formatStr.replace('%entry', logEntry.message)
        else formatStr = formatStr.replace('%entry', '')
        
        if (logEntry.performance !== undefined) formatStr = formatStr.replace('%performance', logEntry.performance)
        else formatStr = formatStr.replace('%performance', '')
        
        if (logEntry.protocol !== undefined) formatStr = formatStr.replace('%protocol', logEntry.protocol)
        else formatStr = formatStr.replace('%protocol', '')
        
        if (logEntry.ip !== undefined) formatStr = formatStr.replace('%ip', logEntry.ip)
        else formatStr = formatStr.replace('%ip', '')
        
        return (formatStr)// + os.EOL)
    }

    showStats() {
        console.log(`logish ${this.#json.name} %o`, this.#stats)
    }
}