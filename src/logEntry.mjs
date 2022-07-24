
import Debug from 'debug'
const debug = Debug('logish:controllers')
import config from './config.mjs'


export class LogEntry {

    /* logish configuration */
    #config = undefined

    /* the log entry */
    #json = {}

    constructor() {
        this.config = config
    }

    get json() { return this.#json }
}