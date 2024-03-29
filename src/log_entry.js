

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

        const dtime = Date.now()
        this.#json.datetime.timestamp = dtime
        // format 2023-03-16 10:40:40 
        let dstr = new Date(dtime)
        this.#json.datetime.dateString = (dstr.toLocaleString('en-US', { 
            hourCycle: 'h23',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            // timeZoneName: 'short'
        })).replace(/,/g, '')
        const dateParts = this.#json.datetime.dateString.split(/[\s,]+/) 
        const month = dateParts[0].split('/')[0] // - 1 // month is zero-indexed in JavaScript
        const day = dateParts[0].split('/')[1]
        const year = dateParts[0].split('/')[2]
        this.#json.datetime.dateString = year +'-'+ month +'-'+ day +' ' + dateParts[1]
        // this.#json.datetime.dateString = new Date(dtime).toISOString().replace('T',' ').split('.')[0]
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