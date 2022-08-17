
import tap from 'tap'
import { Logish } from '../src/logish.js'

tap.pass('tap test')

tap.test('namespace testing', (t) => {
    const log = new Logish()
    t.type(log, Logish)
    log.setNamespace('users:register')
    log.info('informational message', (logEntry) => {
        t.match(logEntry.namespace, 'users:register')
    })
    t.match(log.getNamespace(), 'users:register')
    t.notMatch(log.getNamespace(), 'mynamespace')

    log.setNamespace('blog:create')
    log.info('informational message', (logEntry) => {
        t.match(logEntry.namespace, 'blog:create')
    })
    t.match(log.getNamespace(), 'blog:create')
    t.notMatch(log.getNamespace(), 'users:register')
    t.end()
})

