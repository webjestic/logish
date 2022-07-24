
import Debug from 'debug'
const debug = Debug('logish:file')
import { Controller } from './controller.mjs'


export class ControlFile extends Controller {

    constructor(controllerConfig) {
        super(controllerConfig)
        debug('constructor')
    }

    run(logEntry) {
        super.run(logEntry)
        debug('run', logEntry)
    }

    
}