# Logish

[![CodeQL](https://github.com/webjestic/logish/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/webjestic/logish/actions/workflows/codeql-analysis.yml)

- **Node Version** *Greater Than or Equal To* `node 16`
- ES6 - Bite the bullet and transform commonJS to ES6

**Logish** is designed to be lightweight, simple and configurable. 

Logish is an EventEmitter logging object that triggers a LogEvent on an entry, allowing for customized handling. 
Designed with LogEvent in mind, the intention was to allow developers to hook into the event to route log 
messages to a centralized location (such as a database) or specifically route error and fatal log events to
monitoring or alerting services such as Slack, Discord, or PagerDuty.

I'm an experienced developer, with DevOps and Operations SRE experience. The purpose of this project is to create a logging
system that maintains small log files in a pod (or absolutly no logs in serverless functions), intended to be configured and
developed in an app for centralized logging AND app debugging. Thinking of datadog, elastic, cloudwatch or other implementations.

This should be designed through the log.on() log event EventEmitter and a Logish production configuration. Examples and
documentation to come. Any Logish speed improvements are welcome.


```bash
npm i logish
```
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
- WARN - Something is up, but not going to interupt flow.
- ERROR - Something happend and it will most likly screw something else up.
- FATAL - Something happened, and we need to alert the admins and shut down.

## Contributing

Always welcome people willing to contribute. There is so much to be contributed to any project and should you
choose to controbute to this project, that would be amazing. We do adhere to a (code of condeuct) and we do
implement a workflow process.

### Changelog Entries

- fix: Indciates PR reflects a bug fix (including inline spelling corrections).
- feature: Indicates RP reflects a new feature
- chore: Indicates PR reflects a chore (such as package version increment, code cleaning, or doc cleaening)
- refactor: Indicates PR reflects a better implementation, which coes not change functional outcome
- type: Indicates PR reflects an actual `type` change (such as class to interface)
- ci: Indicates PR is a foundational devops (continious intergration) change
- docs: Indicates PR reflects documentation updatesd
- test: Indicartes PR reflects test enhancements, which may be fixes or features
