
import Debug from 'debug'
const debug = Debug('logish:controller')



export class Controller {

    #config

    constructor(controllerConfig) {
        debug('constructor')
        this.#config = controllerConfig
    }

    get config() { return this.#config}

    run(logEntry) {
        debug('run', logEntry)
    }

}
