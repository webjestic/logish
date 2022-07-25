
import Logish from '../src/index.js'

const conf = {
    level : 'WARN',
    debugging: {
        namespaceOnly: true
    }
}


const log = new Logish(conf, 'app:file')
log.trace('Trace Log')
