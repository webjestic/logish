
import tap from 'tap'
import { Logish } from '../src/logish.js'

tap.pass('tap test')

tap.test('setConfig applies new level', (t) => {
    const log = new Logish()
    log.setConfig({ level: 'warn' })
    t.equal(log.getLevel(), 'warn')
    t.notOk(log.trace('trace msg'))
    t.notOk(log.debug('debug msg'))
    t.notOk(log.info('info msg'))
    t.ok(log.warn('warn msg'))
    t.ok(log.error('error msg'))
    t.ok(log.fatal('fatal msg'))
    t.end()
})

tap.test('setConfig applies performanceTime setting', (t) => {
    const log = new Logish()
    log.setConfig({ level: 'trace', performanceTime: false })
    t.equal(log.getConfig().performanceTime, false)
    t.end()
})

tap.test('setConfig throws on non-object value', (t) => {
    const log = new Logish()
    t.throws(() => log.setConfig('not an object'), Error)
    t.throws(() => log.setConfig(42), Error)
    t.throws(() => log.setConfig(null), Error)
    t.end()
})

tap.test('setConfig throws when level is missing', (t) => {
    const log = new Logish()
    t.throws(() => log.setConfig({ performanceTime: false }), Error)
    t.end()
})

tap.test('setConfig throws on invalid level string', (t) => {
    const log = new Logish()
    t.throws(() => log.setConfig({ level: 'invalid' }), Error)
    t.end()
})

tap.test('setConfig throws when performanceTime is not boolean', (t) => {
    const log = new Logish()
    t.throws(() => log.setConfig({ level: 'trace', performanceTime: 'yes' }), Error)
    t.end()
})
