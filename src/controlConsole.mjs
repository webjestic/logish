
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
        } else {

            if (this.json.colors.useColor === undefined || this.json.colors.useColor !== 'boolean') {
                this.json.colors.useColor = this.#defaultConsoleConfig.colors.useColor
            }

            if (this.json.colors.displayLevels === undefined || this.json.colors.displayLevels !== 'object') {
                this.json.colors.displayLevels = this.#defaultConsoleConfig.colors.displayLevels
            }

            if (this.json.colors.levelColors === undefined || this.json.colors.levelColors !== 'object') {
                this.json.colors.levelColors = this.#defaultConsoleConfig.colors.levelColors
            } else {

                if (this.json.colors.levelColors.trace === undefined || this.json.colors.levelColors.trace !== 'string') {
                    this.json.colors.levelColors.trace = this.#defaultConsoleConfig.colors.levelColors.trace
                }

                if (this.json.colors.levelColors.debug === undefined || this.json.colors.levelColors.debug !== 'string') {
                    this.json.colors.levelColors.debug = this.#defaultConsoleConfig.colors.levelColors.debug
                }

                if (this.json.colors.levelColors.info === undefined || this.json.colors.levelColors.info !== 'string') {
                    this.json.colors.levelColors.info = this.#defaultConsoleConfig.colors.levelColors.info
                }

                if (this.json.colors.levelColors.warn === undefined || this.json.colors.levelColors.warn !== 'string') {
                    this.json.colors.levelColors.warn = this.#defaultConsoleConfig.colors.levelColors.warn
                }

                if (this.json.colors.levelColors.error === undefined || this.json.colors.levelColors.error !== 'string') {
                    this.json.colors.levelColors.error = this.#defaultConsoleConfig.colors.levelColors.error
                }

                if (this.json.colors.levelColors.fatal === undefined || this.json.colors.levelColors.fatal !== 'string') {
                    this.json.colors.levelColors.fatal = this.#defaultConsoleConfig.colors.levelColors.fatal
                }
            }

        }



        debug('controller json %O', this.json)
    }

    
}