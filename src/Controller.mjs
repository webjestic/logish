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
        entries : 0
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
    get stats() { return this.#stats }

    /**
     * 
     * @param {object} logEntry 
     */
    entry() {
        debug('entry')
        this.#stats.entries = this.#stats.entries + 1
    }
}