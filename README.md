# logish

**Logish** is designed to be lightweight and simple. Attempting to offer just the right amount of configurability
and functionality. The goal was to offer file logging options, but mostly to lean on the LogEvent to provide
the mechism for developers to export log entries to centralized locations, such as a MongoDB, Slack, or
other LaaS (Logging as a Service) provider.

```bash
npm i logish
```
## Simple Configuration
This configuration simply logs to the console and emits the LogEvent event.

```javascript
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
    }  
}
```
## Simple Example

Register an event function, that will get called on every log event. 

```javascript
// load Logish object without defining a namespace.
const log = require('./index')(logish_config, ) 

// Register a listener - listens for and triggers on a log event.
log.on('LogEvent', (logEntry) => {
    
    // original log entry, even if it wasn't sent anywhere except to the LogEvent
    if (logEntry.level === 'INFO') 
        console.log(logEntry.message) 
        
    // if sent to console, the logish entry sent to console
    if (logEntry.level === 'FATAL') 
        console.log(logEntry.console)   

    console.log(logEntry)
    // send entire logEntry to MongoDB, Slack, or elsewhere.
    // ...
})

const errorMsg = 'Something bad happened'
const sendThisToo = { byte: 1000000, kilobyte: 1000, megabyte: 1}

// Send multiple arguments, including a callback function.
log.error ('Blowup message', errorMsg, sendThisToo, (logEntry) => {
    console.log ('Logish finished handling the log entry.')
    console.log ('now what? need a callback or not?')
})

// Send a simple info() log entry.
log.info('Mongoose connected to MongoDB successfully. Nice job!')
```

## DEBUG and LOGISH Environment Variables
Run with command line environment variables.
```bash
DEBUG=index,index:subspace node index.js
```

### Resetting Log file_controller
The following configuration will continually reset the log, once the log
reaches the max log size. The log is not trimmed, it is completely reset
upon reaching maxium size.
```javascript
        {
            name: "development",
            tofile: true,
            levels: ["trace", "debug"],
            file: {
                filename: "logs/dev.log",   
                maxsize_in_mb: 0.01,
                backups_kept: 0, // logs/dev_2022-07-14_1.log, logs/dev_2022-07-14_2.log
                gzip_backups : false
            }
        }
```


Shamelessly *inspired by* the concepts and code from [debug](https://www.npmjs.com/package/debug), [winston](https://www.npmjs.com/package/winston) and [log4js](https://www.npmjs.com/package/log4js).