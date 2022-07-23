
import Debug from 'debug'
const debug = Debug('logish:console')
import { Controller } from './controller.mjs'


export class ControlConsole extends Controller {


    constructor(controllerConfig) {
        super(controllerConfig)
        debug('constructor')
    }

    run(logEntry) {
        super.run(logEntry)
        debug('run', logEntry)
    }

    
}