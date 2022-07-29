
import Logish from '../src/index.js'

const conf = {
    level : 'WARN',
    debugging: {
        namespaceOnly: true
    },
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

