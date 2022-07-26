
import Debug from 'debug'
const debug = Debug('logish:controllers')
import config from './config.mjs'


export class Controllers {

    /* array of controller instances */
    #controllers = []

    /* array of pending promises */
    #promises = []

    /* logish configuration */
    #config = undefined

    constructor() {
        debug('constructor')

        // assign the logish conifguration to the local class.
        this.#config = config
    }

    get controllers() { return this.#controllers }
    get config() { return this.#config }

    /**
     * Method responsible for validating the requirements of the controller
     * json configuration, before attempting to load the class.
     * 
     * @access Public
     * @param {object} controller - The json conifguration of a controller.
     */
    addController(controller) {
        debug('addController %O', controller)
        if (typeof controller !== 'object')
            throw new Error('controller is required but bd typeof object.')
        if (typeof controller.name !== 'string') 
            throw new Error('controller.name is required but is not typeof string.')
        if (typeof controller.module !== 'string') 
            throw new Error('controller.module is required but is not typeof string.')
        if (typeof controller.active !== 'boolean') 
            throw new Error('controller.active is required but is not typeof boolean.')
        this.#loadControllerClass(controller)
    }

    /**
     * Method designed to add a controller to the list of controllers to be played.
     * Expects to receive a valid controller json conifguration, defining the Class
     * of the controller, as well as the settings specific to that controller.
     * 
     * @access Protected
     * @param {object} controller - The json conifguration of a controller.
     */
    #loadControllerClass(controller) {
        debug('loadControllerClass')

        // attempt to load a Node module.mjs via a promise
        const mod = import(controller.module)
            .then((ControllerClass) => {
                debug('Controller added: %O', controller.name)

                // dynamically create an instance of the Controller Class.
                const NewObject = new ControllerClass[controller.name](controller)
                debug('ControllerClass %O', typeof ControllerClass[controller.name])
                debug('NewObject %O', NewObject)

                // add the instance to the array of controllers
                this.#controllers.push(NewObject) 
                debug('loadController promises:', this.#promises)

                // remove the promise that was added to the list of pending promises
                this.#promises = this.#promises.filter(item => item !== mod)
            })
            .catch((ex) => {
                debug('catch %O', ex)
                throw new Error(ex)
            })

        // add the pending promise to the list (array) of pending promises
        this.#promises.push(mod)
    }

    /**
     * Responsible for routing the logEntry to all the registered controllers.
     * Waits for all pending promises to complete before processing.
     * 
     * @access Public
     * @param {object} logEntry 
     */
    log(logEntry) {
        debug('process')

        // log entries may be added before controllers have finished creating,
        // therefore, wait for pending promises to complete before processing.
        Promise.allSettled(this.#promises)
            .then(() => {
                debug('processing entries')
                debug('controllers = %O', this.#controllers)

                for (let controller of this.#controllers) {
                    debug('controller= %O', controller)
                    debug('LOGENTRY:', logEntry)
                    debug('active %o', controller.json.active)
                    if( controller.json.active ) controller.run(logEntry)
                }
            })
            .catch(ex => {
                throw new Error(ex)
            })
        debug('process promises:', this.#promises)
    }

}
