
import tap from 'tap'
import { Logish } from '../src/logish.js'

tap.pass('tap test')

tap.test('getLevel on default config', (t) => {
    const log = new Logish()
    t.type(log, Logish)
    t.equal(log.getLevel(), 'trace')
    t.ok(log.trace('trace test msg'))
    t.end()
})

tap.test('getLevel on default config', (t) => {
    const log = new Logish()
    t.type(log, Logish)
    log.setLevel('debug')
    t.equal(log.getLevel(), 'debug')
    t.notOk(log.trace('trace test msg'))
    t.ok(log.debug('debug test msg'))
    t.end()
})