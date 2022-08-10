
import Logish from '../src/index.js'

import { exampleA } from './exampleA.mjs'
import { exampleB } from './exampleB.mjs'


const defaultLogishConfig = {
    level : 'trace',
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


const log = new Logish(logishConfig)
log.setNamespace('example:index')
log.trace('Tracing call')

log.info('Getting started.')
exampleA()
exampleB()

log.debug('entry 1')
log.debug('entry 2')
log.debug('entry 3')

log.showStats()

// Register a listener
log.on('LogEvent', (logEntry) => {
    
    console.log('LogEvent', logEntry)
    
})

log.debug('entry 4')
