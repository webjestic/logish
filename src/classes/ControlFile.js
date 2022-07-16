'use strict'

/*
*/
const os = require('os')
const fs = require('fs')
const path = require('path')

module.exports = class FileControl {

    constructor() {
    }

    /*
    */
    mkdir(controller) {
        try {
            if (!fs.existsSync(path.dirname(controller.file.filename)))
                fs.mkdirSync(path.dirname(controller.file.filename), { recursive: true })
        } catch (e) {
            console.log (e.message, e.code, e.stack)
        }
    }

    /*
    */
    appendToFile(controller, entry) {
        this.prepFilename(controller)
        this.mkdir(controller)
        try {
            fs.appendFileSync(controller.file.filename, entry)
            this.backupFiles(controller)
        } catch (e) {
            console.log (e.message, e.code, e.stack)
        }
    }

    /*
    */
    prepFilename(controller) {
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

    /*
    */
    prepOptions(controller) {
        let options = {
        }
        if ( typeof controller.file.maxsize_in_mb !== 'number' ) controller.file.maxsize_in_mb = 1
            options.maxSize = controller.file.maxsize_in_mb * 1024

        if ( typeof controller.file.backups_kept !== 'number' ) controller.file.backups_kept = 1
            options.numBackups = !controller.file.backups_kept && controller.file.backups_kept !== 0 ? 5 : controller.file.backups_kept

        if ( typeof controller.file.gzip_backups !== 'boolean') controller.file.gzip_backups = false
            options.compress = controller.file.gzip_backups

        return options
    }

    /*
    */
    backupFiles(controller) {

        let options = this.prepOptions(controller)

        //  1 megabyte = 1000 kilobytes and 1 kilobytes = 1000 bytes, rounded to the 4th decimal point
        const stats = fs.statSync(controller.file.filename)
        const mb = Math.round(((stats.size / 1000) / 1000 ) * 10000) /10000 
       // console.log (`${mb}MB max is ${options.maxSize}`)
    }

}
