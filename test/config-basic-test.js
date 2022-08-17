
import tap from 'tap'
import { Logish } from '../src/logish.js'

tap.pass('tap test')

tap.test('default config levels', (t) => {
    const log = new Logish()
    t.type(log, Logish)
    t.ok(log.trace('trace test msg'))
    t.ok(log.debug('debug test msg'))
    t.ok(log.info('info test msg'))
    t.ok(log.warn('warn test msg'))
    t.ok(log.error('error test msg'))
    t.ok(log.fatal('fatal test msg'))
    t.type(log.showStats(), 'object')
    t.end()
})

tap.test('custom config levels', (t) => {
    const logishConfig = {
        level : 'warn'
    }
    const log = new Logish(logishConfig)
    console.log (log.trace('trace test msg'))
    t.type(log, Logish)
    t.notOk(log.trace('trace test msg'))
    t.notOk(log.debug('debug test msg'))
    t.notOk(log.info('info test msg'))
    t.ok(log.warn('warn test msg'))
    t.ok(log.error('error test msg'))
    t.ok(log.fatal('fatal test msg'))
    t.type(log.showStats(), 'object')
    t.end()
})

