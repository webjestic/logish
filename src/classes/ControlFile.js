/**
 * 
 */


const os = require('os')
const fs = require('fs')
const path = require('path')

/**
 * 
 */
module.exports = class FileControl {

    /**
     * 
     */
    constructor() {
    }

    /**
     * @access public
     * 
     * @param {*} controller 
     * @param {*} entry 
     */
    appendToFile(controller, logEntry) {

        let perf = ''
        let entry = undefined
        if (logEntry.perf_time != undefined) perf = `| ${logEntry.perf_time}`
        if (logEntry.message !== undefined)  {
            entry = `${logEntry.timeToString} [${logEntry.level}] ${logEntry.namespace} ${logEntry.hostname} - ${logEntry.message} ${perf}`
            entry += os.EOL
            this.#prepFilename(controller)
            this.#mkdir(controller)
            try {
                this.#backupFiles(controller)
                fs.appendFileSync(controller.file.filename, entry)
                if (logEntry.data) 
                    fs.appendFileSync(controller.file.filename, ('data: '+JSON.stringify(logEntry.data)+os.EOL))
            } catch (e) {
                console.log (e.message, e.code, e.stack)
            }
            logEntry.fileEntry = entry
        } else {
            throw new Error ('No log message. Message is required.')
        }
    }

    /**
     * @access protected
     * 
     * @param {*} controller 
     */
    #prepFilename(controller) {
        if (typeof controller.file.filename !== 'string' || controller.file.filename.length === 0) 
            throw new Error(`Invalid filename: ${controller.file.filename}`)
    
        if( (controller.file.filename.endsWith(path.sep))  )
            throw new Error(`Filename is a directory: ${controller.file.filename}`)

        if ((!controller.file.filename.startsWith(path.sep) && !controller.file.filename.startsWith('.'))) 
            controller.file.filename = process.cwd() + path.sep + controller.file.filename
        
        // handle the ~ (tilde) symbol, translating it to the OS Home Directory
        controller.file.filename = controller.file.filename.replace(new RegExp(`^~(?=${path.sep}.+)`), os.homedir()) 
        controller.file.filename =  path.normalize(controller.file.filename)  
        controller.file.filename =  path.resolve(controller.file.filename)  
    }

    /**
     * 
     * @param {*} controller 
     * @returns 
     */
    #prepOptions(controller) {
        let options = {
        }
        if ( typeof controller.file.maxsize_in_mb !== 'number' ) controller.file.maxsize_in_mb = 1
        options.maxsize_in_mb = controller.file.maxsize_in_mb 

        if ( typeof controller.file.backups_kept !== 'number' ) controller.file.backups_kept = 1
        options.backups_kept = !controller.file.backups_kept && controller.file.backups_kept !== 0 ? 5 : controller.file.backups_kept

        if ( typeof controller.file.gzip_backups !== 'boolean') controller.file.gzip_backups = false
        options.gzip_backups = controller.file.gzip_backups

        return options
    }

    /**
     * 
     * @param {*} controller 
     */
    #backupFiles(controller) {
        let options = this.#prepOptions(controller)

        // 1 megabyte equals 1000 kilobytes and 1000 kilobytes equals 1,000,000 bytes. 
        // rounded to the 4th decimal point
        const stats = this.#stat(controller.file.filename)
        if (stats !== undefined) {
            const mb = Math.round(((stats.size / 1000) / 1000 ) * 10000) /10000 
            if (mb > options.maxsize_in_mb) {
                this.#backupFileName(controller.file.filename, options)
            }
        }
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
            if (ls[index] === undefined && index > options.backups_kept) {
                this.#deleteFile (path.join(dir, ls[index-1]))
            } else {
                if (ls[index] === undefined ) {
                    this.#rotateFile(path.join(dir, ls[index-1]), path.join(dir, `${file}_${date}_${index}${ext}${gzip}` ))
                } else {
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
     * @param {*} controller 
     */
    #mkdir(controller) {
        try {
            if (!fs.existsSync(path.dirname(controller.file.filename)))
                fs.mkdirSync(path.dirname(controller.file.filename), { recursive: true })
        } catch (e) {
            console.log (e.message, e.code, e.stack)
        }
    }

}
