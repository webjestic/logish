
import tap from 'tap'
import { Logish } from '../src/logish.js'

tap.pass('tap test')

tap.test('single data object stored in logEntry.data[0]', (t) => {
    const log = new Logish()
    const dataObj = { key: 'value', count: 1 }
    log.info('test message', dataObj, (logEntry) => {
        t.ok(logEntry.data)
        t.match(logEntry.data[0], dataObj)
    })
    t.end()
})

tap.test('multiple data objects stored at sequential indexes', (t) => {
    const log = new Logish()
    const obj1 = { a: 1 }
    const obj2 = { b: 2 }
    const obj3 = { c: 3 }
    log.info('test message', obj1, obj2, obj3, (logEntry) => {
        t.ok(logEntry.data)
        t.match(logEntry.data[0], obj1)
        t.match(logEntry.data[1], obj2)
        t.match(logEntry.data[2], obj3)
    })
    t.end()
})

tap.test('array argument is appended to message not stored as data', (t) => {
    const log = new Logish()
    const arr = [1, 2, 3]
    log.info('test message', arr, (logEntry) => {
        t.notOk(logEntry.data)
        t.match(logEntry.message, '1,2,3')
    })
    t.end()
})

tap.test('additional string arguments are appended to message', (t) => {
    const log = new Logish()
    log.info('hello', 'world', (logEntry) => {
        t.match(logEntry.message, 'world')
    })
    t.end()
})
