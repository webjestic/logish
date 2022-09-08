
import { Logish } from './../src/logish.js'

// let defaultLogishConfig = {
//     level : 'warn',
//     performanceTime : true,
//     controllers : [
//         {
//             name: 'console',
//             active: true,
//             displayOnlyEnvNamespace: false,
//             displayLevels : ['trace', 'debug', 'info', 'warn', 'error', 'fatal'],
//             format : '%datetime %level %namespace %entry %performance',
//             useColor: true,
//             colors : {
//                 trace   : '\x1b[32m',    debug   : '\x1b[36m',
//                 info    : '\x1b[37m',    warn    : '\x1b[33m',
//                 error   : '\x1b[35m',    fatal   : '\x1b[31m',
//                 reset   : '\x1b[0m'
//             }
//         },
//         {
//             name: 'file',
//             active: false,
//             files: [
//                 {
//                     title: 'application',
//                     active : true,
//                     writeLevels: ['info', 'warn'],
//                     format : '[%datetime %level] %namespace %host - %entry %performance',
//                     filename: 'logs/app.log',   
//                     maxsize_in_mb: 2,
//                     backups_kept: 2, 
//                     gzip_backups : false
//                 },
//                 {
//                     title: 'errors',
//                     active : true,
//                     writeLevels: ['error', 'fatal'],
//                     format : '[%datetime %level] %namespace %host - %entry %performance',
//                     filename: 'logs/errors.log',   
//                     maxsize_in_mb: 2,
//                     backups_kept: 2, 
//                     gzip_backups : false
//                 },
//                 {
//                     title: 'development',
//                     active : true,
//                     writeLevels: ['trace', 'debug'],
//                     format : '[%datetime %level] %namespace %host - %entry %performance',
//                     filename: 'logs/dev.log',   
//                     maxsize_in_mb: 2,
//                     backups_kept: 2, 
//                     gzip_backups : false
//                 }
//             ]
//         }
//     ]
// }

let newConfig = {
    level : 'warn'
}



export function getLogish () {
    if (!Logish.instance) {
        console.log ('NEW INSTANCE')
        return new Logish(newConfig) 
    } else {
        console.log ('INSTANCE ALREADY CREATED')
        return Logish.instance
    }
}