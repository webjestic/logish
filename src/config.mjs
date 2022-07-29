import Debug from 'debug'
const debug = Debug('logish:config')

/**
 * Responsible for ensuring the integrity of the logish configuration.
 * Creating, updating, validating and reconciliation.
 */
export class Config {

    #json = null

    constructor() {
        debug('constructor')
        if (!Config.instance) Config.instance = this
        return Config.instance
    }
    
    getInstance() { return Config.instance }

    get json() { this.#json }
    set json(value) { this.#setJson(value) }

    configure(configJson) {

    }
}