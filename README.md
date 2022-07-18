# logish

Shamelessly *inspired by* the concepts and code from [debug](https://www.npmjs.com/package/debug), [winston](https://www.npmjs.com/package/winston) and [log4js](https://www.npmjs.com/package/log4js).

**Logish** is designed with simplicity in mind. Attempting to offer just the right amount of configurability
and functionality. The goal was to offer file logging options, but mostly to lean on the LogEvent to provide
the mechism for developers to export log entries to centralized locations, such as a MongoDB, Slack, or
other LaaS (Logging as a Service) provider.
## Configuration

```javascript
/**
 * Configuration represents the Logish defaults; however, there are no file_controllers by default.
 * By default, Logish simply sends log entries to the console.
 *
 * The file_controllers shown in sample configuration represent a simple possible production 
 */
const logish_config = {
    log_level : "info",
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
                format : '[%date] [%level] %namespace %host %ip - %entry | %perf %data',
                date : '%Y-%m-%d %H:%M:%S',
                filename: "logs/app.log",   
                maxsize_in_mb: 1,
                backups_kept: 2, 
                gzip_backups : false
            }
        },
        {
            name: "development",
            tofile: true,
            levels: ["trace", "debug"],
            file: {
                format : '[%date] [%level] %namespace %host %ip - %entry | %perf %data',
                date : '%Y-%m-%d %H:%M:%S',
                filename: "logs/dev.log",   
                maxsize_in_mb: 1,
                backups_kept: 2, 
                gzip_backups : false
            }
        }
    ]   
}
```
## Simple Example
```javascript
/**
 * 
 * @param {object} logish_config - JSON object 
 * @param {string} namespace - a logging namespace
 */
const log = require('./index')(logish_config, 'index')

// Register a listener
log.on('LogEvent', (logEntry) => {
    
    // original log entry, even if it wasn't sent anywhere except to the LogEvent
    if (logEntry.level === 'INFO') 
        console.log(logEntry.message) 
        
    // if sent to console, the logish entry sent to console
    if (logEntry.level === 'FATAL') 
        console.log(logEntry.console)   

    // if sent to file, the logish entry sent to file
    if (logEntry.level === 'FATAL') 
        console.log(logEntry.fileEntry) 

    // send entire logEntry to MonboDB 
    // ...
    console.log(logEntry)
    // ...
    // or send to Slack, or something else
})


const errorMsg = 'Something bad happened'
const sendThisToo = { byte: 1000000, kilobyte: 1000, megabyte: 1}
log.error ('Blowup message', errorMsg, sendThisToo, (logEntry) => {
    console.log ('Logish finished handling the log entry.')
    console.log ('now what? need a callback or not?')
})
log.info('Mongoose connected to MongoDB successfully. Nice job!')
```

## DEBUG and LOGISH Environment Variables
Run with command line environment variables.
```bash
DEBUG=index,index:subspace node index.js
```

[funding]("funding": "https://github.com/chalk/supports-color?sponsor=1")

```
package.json
"funding": "https://github.com/chalk/supports-color?sponsor=1",
```

### TODO

- LogConfig - validate formats
- LogConfig - validate array values (levels)
- ControlConsole - implement formats
- ControlFile - implement formats
- ControlFile - implement rollover backups
- ControlFile - implement data{} write to logfile
- LogClass - revisit "returns"

### NPM

- [xo](https://www.npmjs.com/package/xo)