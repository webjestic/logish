
import Debug from 'debug'
const debug = Debug('logish:controller')


/**
 * 
 * 
 */
export class Controller {

    /** Coniguration specific only to the controller */
    #json

    /**
     * 
     * @param {*} controllerConfig 
     */
    constructor(controllerConfig) {
        debug('constructor')
        this.#json = controllerConfig
    }

    get json() { return this.#json}

    /**
     * 
     * @param {object} logEntry 
     */
    run(logEntry) {
        debug('run', logEntry)
    }
}
