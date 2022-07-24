
import Debug from 'debug'
const debug = Debug('logish:controller')


/**
 * 
 */
export class Controller {

    #json

    constructor(controllerConfig) {
        debug('constructor')
        this.#json = controllerConfig
    }

    get json() { return this.#json}

    run(logEntry) {
        debug('run', logEntry)
    }

}
