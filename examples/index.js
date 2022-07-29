
import Logish from '../src/index.js'

const log = new Logish('app:file')
log.trace('Trace Log')
console.log ( log.config )

