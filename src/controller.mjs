
import Debug from 'debug'
const debug = Debug('logish:controller')
import { Config } from './config.mjs'


/**
 * 
 * 
 */
export class Controller {

    /** Coniguration specific only to the controller */
    #json

    /* logish configuration */
    #config = undefined

    /**
     * 
     * @param {*} controllerConfig 
     */
    constructor(controllerConfig) {
        debug('constructor')
        this.#json = controllerConfig
        this.#config = new Config()
    }

    get json() { return this.#json}
    get config() { return this.#config }

    /**
     * 
     * @param {object} logEntry 
     */
    run(logEntry) {
        debug('run', logEntry)
    }
}
