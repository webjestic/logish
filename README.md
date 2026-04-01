# Logish

[![Node.js CI](https://github.com/webjestic/logish/actions/workflows/node-audit.yml/badge.svg)](https://github.com/webjestic/logish/actions/workflows/node-audit.yml)
[![CodeQL](https://github.com/webjestic/logish/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/webjestic/logish/actions/workflows/codeql-analysis.yml)
[![npm version](https://badge.fury.io/js/logish.svg)](https://badge.fury.io/js/logish)

- **Node Version** *Greater Than or Equal To* `node 18`


**Logish** is designed to be lightweight, simple and configurable.

Logish is an EventEmitter logging object that triggers a `LogEvent` on every entry, allowing for customized handling.
Use `LogEvent` to route log entries to a centralized store, or route error and fatal events to alerting services
such as Slack, Discord, or PagerDuty — without any extra libraries.

Designed for containerized and serverless environments. Write to console, let your log aggregation layer (Splunk,
Datadog, CloudWatch, Elastic, etc.) collect from stdout, and use `LogEvent` to handle anything beyond that.


```bash
npm i logish
```
## Production Recommendation

The **file controller is intended for local development only** — not production. In production environments (containerized or serverless), write to console and let your log aggregation layer (Splunk, Datadog, CloudWatch, Elastic, etc.) collect from stdout. File-based logging in a pod or function adds unnecessary I/O, complicates rotation, and works against how those platforms are designed to operate.

For production, disable the file controller and use the `LogEvent` to route entries to your preferred destination.

## Default Configuration
This configuration represents the complete default Logish configuration.

```javascript
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
            useColor: false,
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
```
## Basic Example

Register an event function to execute special instructions on every log entry. 

```javascript

// import ES6
import { Logish } from 'logish'

// load Logish object custom config values.
const log = new Logish(logishConfig)

// or use all defaults by passing no args
const logish = new Logish()

// set namespace for module
log.setNamespace('mod:index')

// Register a listener - listens for and triggers on a log event.
log.on('LogEvent', (logEntry) => {
    
    // send this type of logEntry to discord
    if (logEntry.level === 'FATAL' || logEntry.level === 'ERROR') {
        // send to Discord   
    }

    // send to MongoDB

    console.dir(logEntry)
    // output
    //   logEntry =  {
    //   level: 'debug',
    //   envVars: undefined,
    //   hostname: 'A074709-B957',
    //   message: 'this is the log message',
    //   namespace: 'example:index',
    //   datetime: { timestamp: 1660130422813, dateString: '2022-08-10 11:20:22' },
    //   performance: '0.28(ms)',
    //   entries: [
    //     {
    //       console: '2022-08-10 11:20:22 DEBUG example:index this is the log message 1.18(ms)'
    //     },
    //     {
    //       file_development: '[2022-08-10 11:20:22 DEBUG] A074709-B957 example:index | this is the log message 1.18(ms)\n'
    //     }
    //   ],
    //   data: undefined
}
})

const errorMsg = 'Something bad happened'
const sendThisToo = { byte: 1000000, kilobyte: 1000, megabyte: 1}

// Send multiple arguments, including a callback function.
log.error ('Blowup message', errorMsg, sendThisToo, (logEntry) => {
    console.log ('Inside a callback - who knows why?')
})

// Send a simple info() log entry.
log.trace('constructor()')
log.debug('connStr', connectionString)
log.info('Mongoose connected to MongoDB successfully. Nice job!')
log.error('MongoDB connection failed!', errorObject)
log.trace('END constructor()') 
// output will show time difference between trace calls IF "performanceTime : true"
```

## Dynamic Log Level Control

One of the more powerful production patterns is changing the log level of a running pod **without restarting it**.
Restarting to change a log level kills the process you're trying to debug — and the problem with it.

Because `setLevel()` takes effect immediately, you can wire it to any external config source. The example below
uses a **MongoDB change stream** to watch a config collection. When the document is updated (e.g. changing
`config.logger.level` from `"warn"` to `"debug"`), the change stream fires and the new level is applied live.

```javascript
// logger.js — shared logish instance
import { Logish } from 'logish'

const log = new Logish({ level: 'warn' })
export default log
```

```javascript
// config.js — watches MongoDB for config changes and updates the logger
import log from './logger.js'
import { EventEmitter } from 'events'

class Config extends EventEmitter {

    async init(dbconn) {
        this.dbconn = dbconn
        this.setConfigWatch()
        this.setupDbListeners()
        await this.loadConfig()
    }

    setConfigWatch() {
        this.dbconn.onChange = this.dbconn.model.watch()
        this.dbconn.onChange.on('change', () => {
            this.loadConfig()
            this.emit('configChange')
        })
    }

    setupDbListeners() {
        this.dbconn.connection.on('disconnected', () => {
            this.dbconn.onChange.close()
        })
        this.dbconn.connection.on('reconnected', () => {
            this.setConfigWatch()  // reopen the watch after reconnect
        })
    }

    async loadConfig() {
        const doc = await this.dbconn.model.findOne({}).exec()
        this.config = doc

        // apply the log level from the config document — takes effect immediately, no restart needed
        log.setLevel(this.config.logger.level)
    }

    getConfig() { return this.config }
}

export default new Config()
```

With this in place, updating `logger.level` in your MongoDB config collection changes what gets logged across
all namespaces instantly. Switch from `warn` to `debug` to investigate a live issue, then back to `warn` when
done — the pod never restarts, and you never lose the context you were chasing.

The reconnect handling in `setupDbListeners` is important: MongoDB change streams close when the connection
drops. Reopening the watch on reconnect ensures the live config link is never silently lost.

## LOGISH Process Variables
Run with command line environment variables.
```bash
LOGISH=index,mod:* node index.js
```
Launch with environment variables and set 'displayOnlyEnvNamespace: true' in the configuration
to only log specific entries to console.

This example will log all 'index' namespace entries, and all namespaces with mod:*.

```bash
file1.js log.setNamespace('mod:file1')
file2.js log.setNamespace('mod:file2')
```

## Levels

Introducing standard logging levels, but not necessarily limited to. Give me a reason to extend this...

- TRACE - Intended for code tracing, not stack tracing. (function start & function end as an example)
- DEBUG - Always need to examine values.
- INFO - Standard entry.
- WARN - Something is up, but not going to interrupt flow.
- ERROR - Something happened and it will most likely screw something else up.
- FATAL - Something happened, and we need to alert the admins and shut down.

## Public Methods

- getLevel()
- setLevel(value)
- getNamespace()
- setNamespace(value)
- getConfig()
- setConfig(value)
- showStats()

## Contributing

Always welcome people willing to contribute. [Please read the Open Source Guide.](https://opensource.guide/)
There is so much to be contributed to any project and should you choose to contribute to this project,
that would be amazing. We do adhere to a code of conduct and we do implement a workflow process.


