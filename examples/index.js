
import { getLogish } from './logger.mjs'

import { exampleA } from './exampleA.mjs'
import { exampleB } from './exampleB.mjs'

const log = getLogish()
log.setNamespace('example:index')

function main() {
    log.trace('Strart main()')
    log.fatal('Logish().level =', log.getLevel())

    exampleA()
    exampleB()

    log.warn('Global Warning')
    let obj = { oxy: 'meat', cotten: 'beef'}
    log.warn('actual video', 1000, ['one', 'two', 'three'], obj )

    log.error('Boolean Can run debug? "',  (log.debug('entry 3') ))

    //const logishStats = log.showStats()
    //console.log ('logish stats', logishStats)
    //log.info(logishStats)

    // Register a listener
    /*
    log.on('LogEvent', (logEntry) => {
        console.log('LogEvent', logEntry)
    })
    */

    log.trace('End main()')
}
main()

log.fatal('CURRENT LEVEL=', log.getLevel() )
log.setLevel('trace')
log.fatal('CURRENT LEVEL=', log.getLevel() )
log.trace('trace test')

log.fatal('getConfig()', log.getConfig())
