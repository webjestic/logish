
import { getLogish } from './logger.mjs'

const log = getLogish()
log.setNamespace('example:B')

let func = function (logEntry) {
    console.log('use function', logEntry.level)
}

export function exampleB () {
    log.use(func)
    log.error('Log already created once, and will use that configruation.')
}
