
import Debug from 'debug'
const debug = Debug('logish:controllers')


export class Controllers {

    #controllers = []
    #promises = []

    constructor() {
        debug('constructor')
    }

    get controllers() { return this.#controllers }

    addController(controller) {
        debug('addController %O', controller)
        if (typeof controller.name !== 'string') 
            throw new Error('controller.name is required but is not typeof string.')
        if (typeof controller.module !== 'string') 
            throw new Error('controller.module is required but is not typeof string.')
        this.#loadController(controller)
    }

    #loadController(controller) {
        debug('loadController')

        const mod = import(controller.module)
            .then((ControllerClass) => {
                debug('Controller added: %O', controller.name)

                const NewObject = new ControllerClass[controller.name](controller)
                debug('ControllerClass %O', typeof ControllerClass[controller.name])
                debug('NewObject %O', NewObject)


                this.#controllers.push(NewObject) // TODO: Convert to instance AND pass in controller config
                debug('loadController promises:', this.#promises)
                this.#promises = this.#promises.filter(item => item !== mod)
            })
            .catch(ex => {
                throw new Error(ex)
            })

        this.#promises.push(mod)
    }

    process(logEntry) {
        debug('process')
        Promise.allSettled(this.#promises)
            .then(() => {
                debug('processing entries')
                debug('controllers = %O', this.#controllers)
                for (let control of this.#controllers) {
                    debug('controller= %O', control)
                    debug('LOGENTRY:', logEntry)
                    control.run(logEntry)
                }
            })
            .catch(ex => {
                throw new Error(ex)
            })
        debug('process promises:', this.#promises)
    }

}
