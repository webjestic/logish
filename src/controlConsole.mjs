
import Debug from 'debug'
const debug = Debug('logish:console')
import { Controller } from './controller.mjs'


export class ControlConsole extends Controller {

    #defaultConsoleConfig = {
        name: 'ControlConsole',
        module : './controlConsole.mjs',
        active: true,
        colors: {
            useColor: true,
            displayLevels: ['trace', 'debug', 'info', 'warn', 'error', 'fatal'],
            levelColors: {
                trace   : '\x1b[32m',    debug   : '\x1b[36m',
                info    : '\x1b[37m',    warn    : '\x1b[33m',
                error   : '\x1b[35m',    fatal   : '\x1b[31m'
            }
        }
    }

    constructor(controllerConfig) {
        super(controllerConfig)
        debug('constructor')

        this.#validateControllerConfig()
    }

    /**
     * 
     * @param {object} logEntry 
     */
    run(logEntry) {
        super.run(logEntry)
        debug('run', logEntry)
    }

    #validateControllerConfig() {
        debug('validateControllerConfig')
        debug('controller json %O', this.json)

        if (this.json.colors === undefined || this.json.colors !== 'object') {
            debug('colors not found') 
            this.json.colors = this.#defaultConsoleConfig.colors
        }

        debug('controller json %O', this.json)
    }

    
}