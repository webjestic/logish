
import Debug from 'debug'
const debug = Debug('logish:class')
import { EventEmitter } from 'events'
import { Config } from './config.mjs'

export class Logish extends EventEmitter {

    #config = null

    constructor(configJson, namespace) {
        super()
        debug('constructor')

        this.#config = new Config()
        this.#config.configure(configJson)
    }

}
