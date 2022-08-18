
import { getLogish } from './logger.mjs'

const log = getLogish()
log.setNamespace('example:A')

export function exampleA () {

    log.trace('Start exampleA()')
    log.debug('Debugging message, turn off in config.')
    log.info('Basic information.')
    log.warn('Warning message.')
    log.error('Error is purple.')
    log.fatal('Fatal is red.')
    log.trace('End exampleA()')
}
