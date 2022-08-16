
import { Logish } from './../src/logish.js'


/**
 * Creating instance inside function, because example/index imports this
 * module before creating an example/index isntance. Now, because a previous
 * instance of Logish has been created, this instance will use the previously
 * loaded configuration.
 */
export function exampleA () {
    const log = new Logish()
    log.setNamespace('example:A')

    log.trace('Start exampleA()')
    log.debug('Debugging message, turn off in config.')
    log.info('Basic information.')
    log.warn('Warning message.')
    log.error('Error is purple.')
    log.fatal('Fatal is red.')
    log.trace('End exampleA()')
}
