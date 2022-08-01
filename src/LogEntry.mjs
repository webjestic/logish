
import Debug from 'debug'
const debug = Debug('logish:logentry')
import  os  from 'os'

/**
 * 
 */
export class LogEntry {

    /* the log entry */
    #json = {
        level: undefined,
        namespace: undefined,
        envVars: undefined,
        hostname: undefined,
        message: undefined,
        datetime : {
            timestamp: undefined,
            dateString: undefined
        },
        performance: undefined,
        entries : [],
        data: undefined
    }

    constructor(entry) {
        debug('constructor')

        const dtime = Date.now()
        this.#json.datetime.timestamp = dtime
        this.#json.datetime.dateString = new Date(dtime).toISOString()
        this.#json.hostname = os.hostname()
        this.#updateEntry(entry)

    }

    get json() { return this.#json }
    set json(value) { this.#updateEntry(value) }

    /**
     * 
     * @param {object} value 
     */
    #updateEntry(value) {
        debug('updateEntry')
        if (value.level !== undefined && typeof value.level === 'string')
            this.#json.level = value.level

        if (value.namespace !== undefined && typeof value.namespace === 'string')
            this.#json.namespace = value.namespace

        if (value.message !== undefined && typeof value.message === 'string')
            this.#json.message = value.message

        if (value.performance !== undefined && typeof value.performance === 'string')
            this.#json.performance = value.performance

        if (value.envVars !== undefined && typeof value.envVars === 'object')
            this.#json.envVars = value.envVars

        if (value.entries !== undefined && Array.isArray(value.entries))
            this.#json.entries = value.entries

        if (value.data !== undefined && value.data === 'object')
            this.#json.data = value.data
    }

}