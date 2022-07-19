/**
 * 
 */
'use strict'


/**
 * 
 */
const logish_config = {
    log_level : "trace",
    debugging : {
        log_perf_hooks: true,
        log_only_namespace: false
    },
    console : {
        format : '%namespace [%level] %entry %data | %perf',
        use_colors : true,
        display_levels : ["trace", "debug", "info", "warn", "error", "fatal"],
        colors : {
            trace   : "\x1b[32m",    debug   : "\x1b[36m",
            info    : "\x1b[37m",    warn    : "\x1b[33m",
            error   : "\x1b[35m",    fatal   : "\x1b[31m"
        }
    },
    file_controllers : [
        {
            name: "production",
            tofile: true,
            levels: ["info", "warn", "error", "fatal"],
            file: {
                format : '[%date] [%level] %namespace %host %protocol %ip - %entry | %perf %data',
                date : '%Y-%m-%d %H:%M:%S',
                filename: "logs/app.log",   
                maxsize_in_mb: 0.5,
                backups_kept: 1, // logs/app_2022-07-14_1.log, logs/app_2022-07-14_2.log
                gzip_backups : false
            }
        },
        {
            name: "development",
            tofile: true,
            levels: ["trace", "debug"],
            file: {
                format : '[%date] [%level] %namespace %host %protocol %ip - %entry | %perf %data',
                date : '%Y-%m-%d %H:%M:%S',
                filename: "logs/dev.log",   
                maxsize_in_mb: 0.5,
                backups_kept: 1, // logs/dev_2022-07-14_1.log, logs/dev_2022-07-14_2.log
                gzip_backups : false
            }
        }
    ]   
}

const log = require('../index')(logish_config, 'example')
//const log = require('./index')(logish_config)

// Register a listener
log.on('LogEvent', (logEntry) => {
    
    /*
    if (logEntry.data) 
        console.log (logEntry.console, logEntry.data)
    else
        console.log (logEntry.console)
    */
   // if (logEntry.level === 'INFO') console.log(logEntry)
})


var str = "Hello Logish"
var data = {name: "Joe", age: "30"}
var tether = 100.200
var xp = true
var arr = ['A', 'B', 'C']


log.fatal(str, data, tether, xp, arr, (logEntry) => {
    console.log(logEntry)
})

log.error(str)
log.warn(str)
log.info(str)
log.debug(str, data, logish_config)
log.trace(str)
log.debug(str)
log.trace(str)

setTimeout(() => {
    log.debug(str);
  }, "500") // 12000 12 seconds
setTimeout(() => {
    log.trace(str);
  }, "350") // 62000 seconds
log.info('logEntry')


log.info('Info log')
log.debug('Debug log')


/*
Reset = "\x1b[0m"
Bright = "\x1b[1m"
Dim = "\x1b[2m"
Underscore = "\x1b[4m"
Blink = "\x1b[5m"
Reverse = "\x1b[7m"
Hidden = "\x1b[8m"

FgBlack = "\x1b[30m"
FgRed = "\x1b[31m"
FgGreen = "\x1b[32m"
FgYellow = "\x1b[33m"
FgBlue = "\x1b[34m"
FgMagenta = "\x1b[35m"
FgCyan = "\x1b[36m"
FgWhite = "\x1b[37m"

BgBlack = "\x1b[40m"
BgRed = "\x1b[41m"
BgGreen = "\x1b[42m"
BgYellow = "\x1b[43m"
BgBlue = "\x1b[44m"
BgMagenta = "\x1b[45m"
BgCyan = "\x1b[46m"
BgWhite = "\x1b[47m"
*/


/*

NODE start
COMMON: function setup(env)
COMMON: function enable(namespaces) : namespace  app:test
NODE: function save(namespaces)
COMMON: end function enable(namespaces) 
COMMON: end function setup(env)
COMMON: function createDebug(namespace) : namespace app:test
COMMON: function selectColor(namespace) : namespace app:test
COMMON: end function selectColor(namespace) : hash 1133660747
NODE:  function init(debug)
COMMON: end function createDebug()

COMMON: function debug(...args) : args [ 'Hello', 'World', { name: 'John', lname: 'Doe' } ]
COMMON:  function enable(name) : name app:test
COMMON: function debug(...args) : enabled true
COMMON: if (typeof args[0] !== 'string') { : args[0] Hello
NODE: function formatArgs(args)
NODE: end function formatArgs(args)
NODE: function log(...args)
  app:test Hello World { name: 'John', lname: 'Doe' } +0ms
COMMON: end function debug()

COMMON: function debug(...args) : args [ 'Goodbye', 'World' ]
COMMON: function debug(...args) : enabled true
COMMON: if (typeof args[0] !== 'string') { : args[0] Goodbye
NODE: function formatArgs(args)
NODE: end function formatArgs(args)
NODE: function log(...args)
  app:test Goodbye World +1ms
COMMON: end function debug()

COMMON: function debug(...args) : args [ 'Delayed for 1 second.' ]
COMMON: function debug(...args) : enabled true
COMMON: if (typeof args[0] !== 'string') { : args[0] Delayed for 1 second.
NODE: function formatArgs(args)
NODE: end function formatArgs(args)
NODE: function log(...args)
  app:test Delayed for 1 second. +1s
COMMON: end function debug()

*/