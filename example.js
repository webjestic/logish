'use strict'
/*
*/

const logish_config = {
    log_level : "trace",
    use_perf_hooks: true,
    formats : {
        date : '%Y-%m-%d %H:%M:%S',
        meta : '[{{date}}] [{{level}}] [{{ip}}] {{host}}',
        entry : '{{meta}} | {{namespace}} - {{entry}} {{data}}'
    },
    console : {
        use_colors : true,
        colors : {
            TRACE   : "\x1b[32m",    DEBUG   : "\x1b[36m",
            INFO    : "\x1b[37m",    WARN    : "\x1b[33m",
            ERROR   : "\x1b[35m",    FATAL   : "\x1b[31m"
        }
    },
    controllers : [
        {
            name : "error_control",
            levels: ["error", "fatal"],
            console : true,
            file: {
                use: true,
                name: "/logs/errors.log"
            }
        },
        {
            name : "info_control",
            levels: ["info", "warn"],
            console : false,
            toFile: true,
            file: {
                use: true,
                name: "/logs/app.log"
            }
        },
        {
            name : "debug_control",
            levels : ["trace", "debug"],
            console: true,
            toFile: true,
            file: {
                use: true,
                name: "/logs/debug.log"
            }
        }
    ]   
}

const log = require('./index')(logish_config, 'example.js')

// Register a listener
log.on('LogEvent', (logEntry) => {
    
    if (logEntry.data) 
        console.log (logEntry.console, logEntry.data)
    else
        console.log (logEntry.console)
    
})

var str = "Hello Logish"
log.fatal(str, logish_config, (farg, fparam) => {
    farg = 1
    fparam = 3
    console.log ('callback', (farg + fparam))
})

log.error(str)
log.warn(str)
log.info(str)
log.debug(str)
log.trace(str)
log.debug(str)
log.trace(str)
setTimeout(() => {
    log.debug(str);
  }, "12000") // 12 seconds
setTimeout(() => {
    log.trace(str);
  }, "62000") // 62 seconds



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