

import { Controller } from './controller.js'
import  os  from 'os'
import path from 'path'
import fs from 'fs'


export class ControlFile extends Controller {


    #configDefaultScheme = { 
        active : true,
        files: [
            {
                title: 'application',
                active : true,
                writeLevels: ['info', 'warn'],
                format : '[%datetime %level] %namespace %host - %entry %performance',
                filename: 'logs/app.log',   
                maxsize_in_mb: 2,
                backups_kept: 2, 
                gzip_backups : false
            },
            {
                title: 'errors',
                active : true,
                writeLevels: ['error', 'fatal'],
                format : '[%datetime %level] %namespace %host - %entry %performance',
                filename: 'logs/errors.log',   
                maxsize_in_mb: 2,
                backups_kept: 2, 
                gzip_backups : false
            },
            {
                title: 'development',
                active : true,
                writeLevels: ['trace', 'debug'],
                format : '[%datetime %level] %namespace %host - %entry %performance',
                filename: 'logs/dev.log',   
                maxsize_in_mb: 2,
                backups_kept: 2, 
                gzip_backups : false
            }
        ]
    }

    #json = {}

    constructor(controllerConfig) {
        super(controllerConfig)

        this.#configure(controllerConfig)
    }

    getConfig() { return this.#json }
    setConfig(value) { this.#configure(value) }


    /**
     * 
     * @param {*} controllerConfig 
     * @returns 
     */
    #configure(controllerConfig) {

        let result = false
        if (controllerConfig !== undefined && typeof controllerConfig === 'object') {
            if (this.#validate(controllerConfig)) {
                this.#assignConfigValues(controllerConfig)
                result = true
            }
        } else {
            // completely assign default values to the configuration. overrides the
            // config assignment in the super.constructor
            this.#json = this.#configDefaultScheme
            result = true
        }
        return result
    }

    get json() { return this.#json }
    set json(value) { this.#json = value}

    /**
     * 
     * @param {*} controllerConfig 
     */
    #validate(controllerConfig) {

        // controllerConfig is validated to be typeof object by this.configure at this point

        // if property exists, the validate the type of the property

        if (controllerConfig.files !== undefined && typeof controllerConfig.files === 'object') {
            if (!Array.isArray(controllerConfig.files)) 
                throw new Error ('Provided controller.files is not of typeof "array".')
            
        }

        //debug('controllerConfig %O', controllerConfig)
        if (controllerConfig.files !== undefined) {
            for (let fileController of controllerConfig.files) {
                //debug('fileController %O', fileController)

                if (fileController.title !== undefined 
                    && typeof fileController.title !== 'string')
                    throw new Error ('Provided controller.title is not of typeof "string".')

                if (fileController.active !== undefined 
                    && typeof fileController.active !== 'boolean')
                    throw new Error ('Provided controller.active is not of typeof "boolean".')

                if (fileController.writeLevels !== undefined 
                    && typeof fileController.writeLevels === 'object') {
                    if (!Array.isArray(fileController.writeLevels)) 
                        throw new Error ('Provided controller.writeLevels is not of typeof "array".')
                }

                if (fileController.format !== undefined 
                    && typeof fileController.format !== 'string')
                    throw new Error ('Provided controller.format is not of typeof "string".')

                if (fileController.filename !== undefined 
                    && typeof fileController.filename !== 'string')  
                    throw new Error ('Provided controller.filename is not of typeof "string".')

                if (fileController.maxsize_in_mb != undefined 
                    && typeof fileController.maxsize_in_mb !== 'number')
                    throw new Error ('Provided controller.maxsize_in_mb is not of typeof "number".')

                if (fileController.backups_kept != undefined 
                    && typeof fileController.backups_kept !== 'number')
                    throw new Error ('Provided controller.backups_kept is not of typeof "number".')

                if (fileController.gzip_backups != undefined 
                    && typeof fileController.gzip_backups !== 'boolean')
                    throw new Error ('Provided controller.gzip_backups is not of typeof "boolean".')

            }
        }
        return true
    }

    /**
     * 
     * @param {*} controllerConfig 
     */
    #assignConfigValues(controllerConfig) {
        
        if (controllerConfig.name !== undefined) 
            this.#json.name = controllerConfig.name
        else 
            this.#json.name = this.#configDefaultScheme.name

        if (controllerConfig.files === undefined) 
            controllerConfig.files = this.#configDefaultScheme.files

        if (controllerConfig.active !== undefined) this.#json.active = controllerConfig.active
        else this.#json.active = this.#configDefaultScheme.active

        // if property exists then assign the value - otherwise assign the default value
        this.#json.files = this.#configDefaultScheme.files
        let idx = 0
        for (let fileController of controllerConfig.files) {

            if (fileController.title !== undefined) 
                this.#json.files[idx].title = fileController.title
            else
                this.#json.files[idx].title = this.#configDefaultScheme.files[idx].title

            if (fileController.active !== undefined) 
                this.#json.files[idx].active = fileController.active
            else 
                this.#json.files[idx].active = fileController.active

            if (fileController.writeLevels !== undefined) 
                this.#json.files[idx].writeLevels = fileController.writeLevels.map(lvl => lvl.toLowerCase())
            else 
                this.#json.files[idx].writeLevels = this.#configDefaultScheme.files[idx].writeLevels

            if (fileController.format !== undefined) this.#json.files[idx].format = fileController.format
            else this.#json.files[idx].format = this.#configDefaultScheme.files[idx].format

            if (fileController.filename !== undefined) 
                this.#json.files[idx].filename = fileController.filename
            else 
                this.#json.files[idx].filename = this.#configDefaultScheme.files[idx].filename

            if (fileController.maxsize_in_mb !== undefined) 
                this.#json.files[idx].maxsize_in_mb = fileController.maxsize_in_mb
            else 
                this.#json.files[idx].maxsize_in_mb = this.#configDefaultScheme.files[idx].maxsize_in_mb

            if (fileController.backups_kept !== undefined) this.#json.files[idx].backups_kept = fileController.backups_kept
            else this.#json.files[idx].backups_kept = this.#configDefaultScheme.files[idx].backups_kept

            if (fileController.gzip_backups !== undefined) 
                this.#json.files[idx].gzip_backups = fileController.gzip_backups
            else 
                this.#json.files[idx].gzip_backups = this.#configDefaultScheme.files[idx].gzip_backups

            idx += idx
        }

        idx = 0
        for (let fileController of this.#json.files) {
            // update fileController.filename with proper, full path.
            this.#prepFilename(fileController, idx)
            // create log folder if needed
            this.#mkdir(fileController)
            idx += idx
        }
        
    }

    /**
     * 
     * @param {object} logEntry 
     */
    entry(logEntry) {
        super.entry(logEntry)
        //debug('entry')

        //debug(this.#json.files)
        for (let fileController of this.#json.files) {
            //debug('fileController %O', fileController)
            if (fileController.active === true) {
                if (fileController.writeLevels.indexOf(logEntry.level.toLowerCase()) > -1)
                    this.appendToFile(fileController, logEntry)
            }
        }
    }

    /**
     * @access public
     * 
     * @param {*} controller 
     * @param {*} entry 
     */
    appendToFile(controller, logEntry) {

        let entry = undefined
        if (logEntry.message !== undefined)  {
            entry = super.formatEntry(logEntry, controller.format)
            entry += os.EOL
            //debug('entr: %o', entry)
            
            try {
                this.#backupFiles(controller)
                fs.appendFileSync(controller.filename, entry)
                if (logEntry.data) 
                    fs.appendFileSync(controller.filename, ('data: '+JSON.stringify(logEntry.data)+os.EOL))
            } catch (e) {
                console.log (e.message, e.code, e.stack)
            }
            

            const fileKey = `file_${controller.title}`
            logEntry.entries.push( { [fileKey]: entry } )
        } else 
            throw new Error ('No log message. Message is required to add a log entry.')
    }

    /**
     * @access protected
     * 
     * @param {*} controller 
     */
    #prepFilename(controller, idx) {
        if (typeof controller.filename !== 'string' || controller.filename.length === 0) 
            throw new Error(`Invalid filename: ${controller.filename}`)
    
        if( (controller.filename.endsWith(path.sep))  )
            throw new Error(`Filename is a directory: ${controller.filename}`)

        if ((!controller.filename.startsWith(path.sep) && !controller.filename.startsWith('.'))) 
            this.#json.files[idx].filename = (process.cwd() + path.sep + controller.filename)
        
        // handle the ~ (tilde) symbol, translating it to the OS Home Directory
        this.#json.files[idx].filename 
            = this.#json.files[idx].filename.replace(new RegExp(`^~(?=${path.sep}.+)`), os.homedir()) 
        this.#json.files[idx].filename =  path.normalize(this.#json.files[idx].filename)  
        this.#json.files[idx].filename =  path.resolve(this.#json.files[idx].filename)  
    }

    /**
     * 
     * @param {*} controller 
     */
    #mkdir(controller) {
        try {
            if (!fs.existsSync(path.dirname(controller.filename)))
                fs.mkdirSync(path.dirname(controller.filename), { recursive: true })
        } catch (e) {
            console.log (e.message, e.code, e.stack)
        }
    }

    /**
     * 
     * @param {*} controller 
     */
    #backupFiles(controller) {
        let options = this.#prepOptions(controller)

        // 1 megabyte equals 1000 kilobytes and 1000 kilobytes equals 1,000,000 bytes. 
        // rounded to the 4th decimal point
        const stats = this.#stat(controller.filename)
        if (stats !== undefined) {
            const mb = Math.round(((stats.size / 1000) / 1000 ) * 10000) /10000 
            if (mb > options.maxsize_in_mb)
                this.#backupFileName(controller.filename, options)
        }
    }

    /**
     * 
     * @param {*} controller 
     * @returns 
     */
    #prepOptions(controller) {
        let options = {
        }
        if ( typeof controller.maxsize_in_mb !== 'number' ) controller.maxsize_in_mb = 1
        options.maxsize_in_mb = controller.maxsize_in_mb 

        if ( typeof controller.backups_kept !== 'number' ) controller.backups_kept = 1
        options.backups_kept = !controller.backups_kept && controller.backups_kept !== 0 ? 5 : controller.backups_kept

        if ( typeof controller.gzip_backups !== 'boolean') controller.gzip_backups = false
        options.gzip_backups = controller.gzip_backups

        return options
    }

    /**
     * 
     * @param {*} filename 
     * @returns 
     */
    #stat(filename) {
        let result = undefined
        try {
            if (fs.existsSync(filename))
                result = fs.statSync(filename)
        } catch(e) {
            console.log (e.message, e.code, e.stack)
        }
        return result
    }

    /**
     * 
     * @param {*} filename 
     * @param {*} options 
     */
    #backupFileName(filename, options) {
        
        const dir = path.dirname(filename)
        const ext = path.extname(filename)
        const file = path.basename(filename, ext)
        const date = (new Date().toISOString()).substring(0,10)
        const gzip = options.gzip_backups ? '.gz' : ''

        const ls = this.#readdirSync(dir, file)

        // CREATE PROCESS ORDER
        for (let index = ls.length; index >= 0; index--) {
            if (ls[index] === undefined && index > options.backups_kept) 
                this.#deleteFile (path.join(dir, ls[index-1]))
            else {
                if (ls[index] === undefined ) 
                    this.#rotateFile(path.join(dir, ls[index-1]), path.join(dir, `${file}_${date}_${index}${ext}${gzip}` ))
                else {
                    if (ls[index-1] !== undefined)
                        this.#rotateFile(path.join(dir, ls[index-1]), path.join(dir, ls[index]))
                }
            }
        }
    }

    /**
     * 
     * @param {*} dir 
     * @param {*} file 
     * @returns 
     */
    #readdirSync(dir, file) {
        let result = undefined
        try {
            return fs.readdirSync(dir).filter(n => {return n.includes(file)}).sort()
        } catch (e) {
            console.log (e.message, e.code, e.stack)
        }
        return result
    }

    /**
     * 
     * @param {*} filename 
     */
    #deleteFile(filename) {
        try {
            fs.rmSync(filename)
        } catch (e) {
            console.log (e.message, e.code, e.stack)
        }
    }

    /**
     * 
     * @param {*} filename 
     * @param {*} targetFile 
     */
    #rotateFile(filename, targetFile) {
        try {
            fs.renameSync(filename, targetFile)
        } catch (e) {
            console.log (e.message, e.code, e.stack)
        }
    }
    
}