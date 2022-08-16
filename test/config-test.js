
import tap from 'tap'
import { Logish } from './../src/logish.js'

tap.pass('tap test')

tap.test('default config levels', (t) => {
    const log = new Logish()
    t.type(log, Logish)
    t.equal(log.trace('trace test msg'), true)
    t.equal(log.debug('debug test msg'), true)
    t.equal(log.info('info test msg'), true)
    t.equal(log.warn('warn test msg'), true)
    t.equal(log.error('error test msg'), true)
    t.equal(log.fatal('fatal test msg'), true)
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
    t.equal(log.trace('trace test msg'), true)
    t.equal(log.debug('debug test msg'), true)
    t.equal(log.info('info test msg'), true)
    t.equal(log.warn('warn test msg'), true)
    t.equal(log.error('error test msg'), true)
    t.equal(log.fatal('fatal test msg'), true)
    t.type(log.showStats(), 'object')
    t.end()
})

