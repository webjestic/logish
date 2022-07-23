
import Debug from 'debug'
const debug = Debug('logish:class')
import { EventEmitter } from 'events'
import { Config } from './config.mjs'
import { Controllers } from './controllers.mjs'



export class Logish extends EventEmitter {

    #namespace = undefined
    #config = undefined
    #controllers = undefined


    constructor(config, namespace) {
        super()
        debug('constructor')

        this.#resolveConstructorArgs(config, namespace)
        this.#config = new Config(config)
        this.#controllers = new Controllers()    

        this.#setup()
    }

    get controllers() { return this.#controllers.controllers }
    get config() { return this.#config.json }

    #resolveConstructorArgs(config, namespace) {
        debug('resolveConstructorArgs %O', config, namespace)
        this.#namespace = namespace
    }

    #setup() {
        debug('setup')
        this.#setupControllers()
    }

    #setupControllers() {
        debug('setupControllers')
        for (let controller of (this.#config.json).controllers) {
            this.addController(controller)
        }
    }

    /**
     * Method exists to allow external controllers to be added.
     * 
     * @access Public
     * @param {object} controller - Json object, usually defined in logish_config.controllers[]
     */
    addController(controller) {
        debug('addController')
        this.#controllers.addController(controller)
    }

    log(logEntry) {
        debug('log')
        this.#controllers.process(logEntry)
    }


}