
import Debug from 'debug'
const debug = Debug('logish:logentry')
import os from 'os'

/**
 * Container for all log entry details.
 */
export class LogEntry {

    /* the log entry */
    #json = {
        level: undefined,
        envVars: undefined,
        hostname: undefined,
        message: undefined,
        namespace: undefined,
        datetime : {
            timestamp: undefined,
            dateString: undefined
        },
        performance: undefined,
        entries : [],
        data: undefined
    }

    /**
     * Initializes a standard logEntry object.
     * 
     * @param {json} entry Simple json containing basic starter information for a log entry
     */
    constructor(entry) {
        debug('constructor')

        debug('constructor-entry %O', entry)

        const dtime = Date.now()
        this.#json.datetime.timestamp = dtime
        this.#json.datetime.dateString = new Date(dtime).toISOString().replace('T',' ').split('.')[0]
        this.#json.hostname = os.hostname()
        this.#updateEntry(entry)
    }

    get json() { return this.#json }
    set json(value) { this.#updateEntry(value) }

    /**
     * Responsible for assigning the values of an initial log entry.
     * 
     * @param {json} entry Simple json containing basic starter information for a log entry
     */
    #updateEntry(entry) {
        debug('updateEntry')
        //debug('entry %O', entry)
        if (entry.level !== undefined && typeof entry.level === 'string')
            this.#json.level = entry.level

        if (entry.namespace !== undefined && typeof entry.namespace === 'string')
            this.#json.namespace = entry.namespace

        if (entry.message !== undefined && typeof entry.message === 'string')
            this.#json.message = entry.message

        if (entry.performance !== undefined && typeof entry.performance === 'string')
            this.#json.performance = entry.performance

        if (entry.envVars !== undefined && typeof entry.envVars === 'object')
            this.#json.envVars = entry.envVars

        if (entry.entries !== undefined && Array.isArray(entry.entries))
            this.#json.entries = entry.entries

        if (entry.data !== undefined && typeof entry.data === 'object')
            this.#json.data = entry.data
    }
}