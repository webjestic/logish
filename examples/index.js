
import { Logish } from './../src/logish.js'

import { exampleA } from './exampleA.mjs'
import { exampleB } from './exampleB.mjs'


const defaultLogishConfig = {
    level : 'warn',
    performanceTime : true,
    controllers : [
        {
            name: 'console',
            active: true,
            displayOnlyEnvNamespace: false,
            displayLevels : ['trace', 'debug', 'info', 'warn', 'error', 'fatal'],
            format : '%datetime %level %namespace %entry %performance',
            useColor: true,
            colors : {
                trace   : '\x1b[32m',    debug   : '\x1b[36m',
                info    : '\x1b[37m',    warn    : '\x1b[33m',
                error   : '\x1b[35m',    fatal   : '\x1b[31m',
                reset   : '\x1b[0m'
            }
        },
        {
            name: 'file',
            active: true,
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
    ]
}


const logishConfig = defaultLogishConfig

let newConfig = {
    level : 'warn'
}

const log = new Logish(newConfig)
log.setNamespace('example:index')

function main() {
    log.trace('Strart main()')
    log.fatal('Logish().level =', log.getLevel())

    exampleA()
    exampleB()

    log.warn(logishConfig)
    let obj = { oxy: 'meat', cotten: 'beef'}
    log.warn('actual video', 1000, ['one', 'two', 'three'], obj )

    log.error('Boolean Can run debug? "',  (log.debug('entry 3') ))

    //const logishStats = log.showStats()
    //console.log ('logish stats', logishStats)
    //log.info(logishStats)

    // Register a listener
    /*
    log.on('LogEvent', (logEntry) => {
        console.log('LogEvent', logEntry)
    })
    */

    log.trace('End main()')
}
main()

log.fatal('CURRENT LEVEL=', log.getLevel() )
log.setLevel('trace')
log.fatal('CURRENT LEVEL=', log.getLevel() )
log.trace('trace test')

// Logish.getConfig() -> Config.getConfig() 
// Logish.getCongig().controllers -> ControlHandler.getConfig() -> ControlConsole.getConfig()
log.fatal('getConfig()', log.getConfig())
