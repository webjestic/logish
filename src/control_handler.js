
import { ControlFile } from './control_file.js'
import { ControlConsole } from './control_console.js'

/**
 * 
 */
export class ControlHandler {

    /* array of controller instances */
    #controllers = []

    /**
     * @pattern Singleton
     * 
     * @param {array of objects} controllers - config.controllers is passed in
     * 
     * @returns instance
     */
    constructor(controllers) {
        //debug ('controllers %O', controllers)

        // if (!ControlHandler.instance) {
        //     for (let controllerIndex in controllers) 
        //         this.#addController(controllers[controllerIndex])
            
        //     ControlHandler.instance = this
        // }
        // return ControlHandler.instance
        for (let controllerIndex in controllers) 
            this.#addController(controllers[controllerIndex])
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
        //debug('controller %O', controller)

        //this.#loadControllerClass(controller)
        if (controller.name === 'console')
            this.#controllers.push(new ControlConsole(controller))
        if (controller.name === 'file')
            this.#controllers.push(new ControlFile(controller))
    }


    /**
     * Responsible for routing the logEntry to all the registered controllers.
     * Waits for all pending promises to complete before processing.
     * 
     * @access Public
     * @param {object} logEntry 
     */
    entry(logEntry) {
        //debug(logEntry)
    
        // log entries may be added before controllers have finished creating,
        // therefore, wait for pending promises to complete before processing.
        for (let controller of this.#controllers) {
            if( controller.json.active )
                controller.entry(logEntry)
        }
        
    }

    /**
     * Shows the statistics for the running instance, from all controllers.
     */
    showStats() {
        let result = []
        for (let controller of this.#controllers) {
            if( controller.json.active ) 
                result.push( controller.showStats() )
        }
        return result
    }

}
