
import tap from 'tap'
import { Logish } from '../src/logish.js'

tap.pass('tap test')

tap.test('showStats returns array of controller stat objects', (t) => {
    const log = new Logish()
    const stats = log.showStats()
    t.type(stats, Array)
    t.ok(stats.length > 0)
    t.end()
})

tap.test('showStats console entry has correct shape', (t) => {
    const log = new Logish()
    const stats = log.showStats()
    const consoleStat = stats.find(s => s.controller === 'console')
    t.ok(consoleStat)
    t.type(consoleStat.total, 'number')
    t.type(consoleStat.trace, 'number')
    t.type(consoleStat.debug, 'number')
    t.type(consoleStat.info, 'number')
    t.type(consoleStat.warn, 'number')
    t.type(consoleStat.error, 'number')
    t.type(consoleStat.fatal, 'number')
    t.end()
})

tap.test('showStats counts reflect logged entries', (t) => {
    const log = new Logish()
    log.info('first')
    log.info('second')
    log.warn('a warning')
    log.error('an error')
    const consoleStat = log.showStats().find(s => s.controller === 'console')
    t.equal(consoleStat.total, 4)
    t.equal(consoleStat.info, 2)
    t.equal(consoleStat.warn, 1)
    t.equal(consoleStat.error, 1)
    t.end()
})
