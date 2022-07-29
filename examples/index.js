
import Logish from '../src/index.js'

const conf = {
    level : 'WARN',
    debug : {
        namespaceOnly : false,
        performanceTime : true
    },
    // controllers are only away of settings within the controller.
    // Logish class uses settings outside of controllers to
    // determine if controllers should be executed.
    controllers: [
        {
            classname: 'ControlConsole',
            module : './controlConsole.mjs',
            active: true
        },
        {
            classname: 'ControlFile',
            module : './controlFile.mjs',
            active: true
        }
    ]
}

const log = new Logish(conf, 'app:file')
log.trace('Trace Log')

