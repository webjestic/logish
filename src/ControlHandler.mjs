
import Debug from 'debug'
const debug = Debug('logish:controlHandler')
import { ControlFile } from './ControlFile.mjs'
import { ControlConsole } from './ControlConsole.mjs'

export class ControlHandler {

    /* array of controller instances */
    #controllers = []
    //#promises = []

    /**
     * @pattern Singleton
     * 
     * @param {array of objects} controllers - config.controllers is passed in
     * @returns instance
     */
    constructor(controllers) {
        debug('constructor')
        //debug ('controllers %O', controllers)

        if (!ControlHandler.instance) {
            for (let controllerIndex in controllers) 
                this.#addController(controllers[controllerIndex])
            
            ControlHandler.instance = this
        }
        return ControlHandler.instance
    }

    get controllers() { return this.#controllers }
    getInstance() { return ControlHandler.instance }

    /**
     * Method responsible for validating the requirements of the controller
     * json configuration, before attempting to load the class.
     * 
     * @access Public
     * @param {object} controller - The json conifguration of a controller.
     */
    async #addController(controller) {
        debug('addController')
        //debug('controller %O', controller)

        //this.#loadControllerClass(controller)
        if (controller.name === 'console')
            this.#controllers.push(new ControlConsole(controller))
        if (controller.name === 'file')
            this.#controllers.push(new ControlFile(controller))
    }

    /**
     * Method designed to add a controller to the list of controllers to be played.
     * Expects to receive a valid controller json conifguration, defining the Class
     * of the controller, as well as the settings specific to that controller.
     * 
     * @access Protected
     * @param {object} controller - The json conifguration of a controller.
     */
    
    /*
    #loadControllerClass(controller) {
        debug('loadControllerClass')

        // attempt to load a Node module.mjs via a promise
        const mod = import(controller.module)
            .then((ControllerClass) => {
                //debug('Controller added: %O', controller.classname)

                // dynamically create an instance of the Controller Class.
                const NewObject = new ControllerClass[controller.classname](controller)
                //debug('ControllerClass %O', typeof ControllerClass[controller.classname])
                //debug('NewObject %O', NewObject)

                // add the instance to the array of controllers
                this.#controllers.push(NewObject) 
                //debug('loadController promises:', this.#promises)

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
    */
    

    /**
     * Responsible for routing the logEntry to all the registered controllers.
     * Waits for all pending promises to complete before processing.
     * 
     * @access Public
     * @param {object} logEntry 
     */
    entry(logEntry) {
        debug('entry')
        //debug(logEntry)
    
        // log entries may be added before controllers have finished creating,
        // therefore, wait for pending promises to complete before processing.
        /*
        Promise.allSettled(this.#promises)
            .then(() => {
                debug('processing entries')
                //debug('controllers = %O', this.#controllers)

                for (let controller of this.#controllers) {
                    //debug('controller= %O', controller)
                    //debug('LOGENTRY:', logEntry)
                    //debug('active %o', controller.json.active)
                    if( controller.json.active ) 
                        controller.entry(logEntry)
                }
            })
            .catch(ex => {
                debug(ex)
                throw new Error(ex)
            })
        debug('process promises:', this.#promises)
        */
        for (let controller of this.#controllers) {
            if( controller.json.active )
                controller.entry(logEntry)
        }
        
    }

    showStats() {
        /*
        Promise.allSettled(this.#promises)
            .then(() => {
                for (let controller of this.#controllers) {
                    if( controller.json.active ) 
                        controller.showStats()
                }
            })
            .catch(ex => {
                debug(ex)
                throw new Error(ex)
            })
        */
        for (let controller of this.#controllers) {
            if( controller.json.active ) 
                controller.showStats()
        }
    }

}
