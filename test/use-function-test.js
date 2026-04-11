
import tap from 'tap'
import { Logish } from '../src/logish.js'

tap.pass('tap test')

tap.test('use() registers function and receives logEntry', (t) => {
    let level = undefined
    const func = function (logEntry) {
        level = logEntry.level
    }
    const log = new Logish()
    log.use(func)
    log.error('test message')
    t.match(level, 'error')
    t.end()
})

tap.test('use() throws when called with no argument', (t) => {
    const log = new Logish()
    t.throws(() => log.use(), Error)
    t.end()
})

tap.test('use() throws when argument is not a function', (t) => {
    const log = new Logish()
    t.throws(() => log.use('not a function'), Error)
    t.throws(() => log.use(42), Error)
    t.end()
})
