
import tap from 'tap'
import { Logish } from '../src/logish.js'

tap.pass('tap test')

tap.test('logish.use add function', (t) => {
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
