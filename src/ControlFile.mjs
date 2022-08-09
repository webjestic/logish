import Debug from 'debug'
const debug = Debug('logish:file')
import { Controller } from './Controller.mjs'


export class ControlFile extends Controller {


    #configDefaultScheme = { 
        files: [
            {
                title: 'application',
                active : true,
                writeLevels: ['info', 'warn'],
                format : '[%date] [%level] %namespace %host %protocol %ip - %entry %performance',
                filename: 'logs/app.log',   
                maxsize_in_mb: 2,
                backups_kept: 2, 
                gzip_backups : false
            },
            {
                title: 'errors',
                active : true,
                writeLevels: ['error', 'fatal'],
                format : '[%date] [%level] %namespace %host %protocol %ip - %entry %perf',
                filename: 'logs/errors.log',   
                maxsize_in_mb: 2,
                backups_kept: 2, 
                gzip_backups : false
            },
            {
                title: 'development',
                active : true,
                writeLevels: ['trace', 'debug'],
                format : '[%date] [%level] %namespace %host %protocol %ip - %entry %perf',
                filename: 'logs/dev.log',   
                maxsize_in_mb: 2,
                backups_kept: 2, 
                gzip_backups : false
            }
        ]
    }

    constructor(controllerConfig) {
        super(controllerConfig)
        debug('constructor')

        this.configure(controllerConfig)
        debug('end constructor')
    }

    /**
     * 
     * @param {*} controllerConfig 
     * @returns 
     */
    configure(controllerConfig) {

        let result = false
        if (controllerConfig !== undefined && typeof controllerConfig === 'object') {
            if (this.validate(controllerConfig)) {
                debug('validate pass')
                debug('json assigned')
                this.#assignConfigValues(controllerConfig)
                result = true
            }
        } else {
            // completely assign default values to the configuration. overrides the
            // config assignment in the super.constructor
            this.json = this.#configDefaultScheme
            result = true
        }
        return result
    }

    /**
     * 
     * @param {*} controllerConfig 
     */
    validate(controllerConfig) {
        debug('validate')

        // controllerConfig is validated to be typeof object by this.configure at this point

        // if property exists, the validate the type of the property

        if (controllerConfig.files !== undefined && typeof controllerConfig.files === 'object') {
            if (!Array.isArray(controllerConfig.files)) {
                throw new Error ('Provided controller.files is not of typeof "array".')
            }
        } else {
            throw new Error ('Provided controller.files is not typeof "object(array)".')
        }

        //debug('controllerConfig %O', controllerConfig)
        for (let fileController of controllerConfig.files) {
            //debug('fileController %O', fileController)

            if (fileController.title !== undefined && typeof fileController.title !== 'string')
                throw new Error ('')

            if (fileController.active !== undefined && typeof fileController.active !== 'boolean')
                throw new Error ('')

            if (fileController.writeLevels !== undefined && typeof fileController.writeLevels !== 'object')
                if (!Array.isArray(fileController.writeLevels))
                    throw new Error ('')

            if (fileController.format !== undefined && typeof fileController.format !== 'string')
                throw new Error ('')

            if (fileController.filename !== undefined && typeof fileController.filename !== 'string')  
                throw new Error ('')

            if (fileController.maxsize_in_mb != undefined && typeof fileController.maxsize_in_mb !== 'number')
                throw new Error ('')

            if (fileController.backups_kept != undefined && typeof fileController.backups_kept !== 'number')
                throw new Error ('')

            if (fileController.gzip_backups != undefined && typeof fileController.gzip_backups !== 'boolean')
                throw new Error ('')

        }
        return true
    }

    /**
     * 
     * @param {*} controllerConfig 
     */
    #assignConfigValues(controllerConfig) {
        debug('assignConfigValues')
        
        // if property exists then assign the value - otherwise assign the default value
        let idx = 0
        
        for (let fileController of controllerConfig.files) {

            debug('Title', this.#configDefaultScheme.files[idx].title)

            if (fileController.title !== undefined) this.json.files[idx].title = fileController.title
            else this.json.files[idx].title = this.#configDefaultScheme.files[idx].title

            if (fileController.active !== undefined) this.json.files[idx].active = fileController.active
            else this.json.files[idx].active = fileController.active

            if (fileController.writeLevels !== undefined) this.json.files[idx].writeLevels = fileController.writeLevels
            else this.json.files[idx].writeLevels = this.#configDefaultScheme.files[idx].writeLevels

            if (fileController.format !== undefined) this.json.files[idx].format = fileController.format
            else this.json.files[idx].format = this.#configDefaultScheme.files[idx].format

            if (fileController.filename !== undefined) this.json.files[idx].filename = fileController.filename
            else this.json.files[idx].filename = this.#configDefaultScheme.files[idx].filename

            if (fileController.maxsize_in_mb !== undefined) this.json.files[idx].maxsize_in_mb = fileController.maxsize_in_mb
            else this.json.files[idx].maxsize_in_mb = this.#configDefaultScheme.files[idx].maxsize_in_mb

            if (fileController.backups_kept !== undefined) this.json.files[idx].backups_kept = fileController.backups_kept
            else this.json.files[idx].backups_kept = this.#configDefaultScheme.files[idx].backups_kept

            if (fileController.gzip_backups !== undefined) this.json.files[idx].gzip_backups = fileController.gzip_backups
            else this.json.files[idx].gzip_backups = this.#configDefaultScheme.files[idx].gzip_backups

            debug('Title', this.json.files[idx].title)

            idx++
        }
        
    }

    /**
     * 
     * @param {object} logEntry 
     */
    entry(logEntry) {
        super.entry(logEntry)
        //debug('entry')

        
    }
    
}