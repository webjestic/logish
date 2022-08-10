
import { it, expect, describe } from 'vitest'
import { Logish } from '../src/Logish.mjs'

var logishConfig = {
    level : 'warn'
}

describe('#1 Logish constructor :', () => {
    it('Logish.constructor using DEFAULT config', () => {
        expect(new Logish()).toBeInstanceOf(Logish)
    })

    it('#3 Logish.constructor using CUSTOM config', () => {
        expect(new Logish(logishConfig)).toBeInstanceOf(Logish)
    })

    it('#5 Logish constructor Throws an Error.', () => {
        expect(() => new Logish(1).toThrowError(/Logish/))
    })

    it('#6 Logish constructor Throws a CONFIG Error with namespace.', () => {
        expect(() => new Logish('notObject').toThrowError(/Array/))
    })

    it('#7 Logish constructor Throws a CONFIG Error with NO namespace.', () => {
        expect(() => new Logish([]).toThrowError(/Array/))
    })
})

describe('Logish log levels :', () => {
    it('#8 Logish log entry: TRACE', () => {
        const log = new Logish(logishConfig)
        const result = log.trace('trace test')
        console.log (result)
        expect ( result ).toBe(false)
    })

    it('#9 Logish log entry: DEBUG', () => {
        expect((new Logish(logishConfig)).debug('debug test') ).toBe(false)
    })

    it('#10 Logish log entry: INFO', () => {
        expect((new Logish(logishConfig)).info('debug test') ).toBe(false)
    })

    it('#11 Logish log entry: WARN', () => {
        expect((new Logish(logishConfig)).warn('debug test') ).toBe(true)
    })

    it('#12 Logish log entry: ERROR', () => {
        expect((new Logish(logishConfig)).error('debug test') ).toBe(true)
    })

    it('#13 Logish log entry: FATAL', () => {
        expect((new Logish(logishConfig)).fatal('debug test') ).toBe(true)
    })

    it('#14 Logish log entry: LOG', () => {
        expect(() => (new Logish(logishConfig)).log('log test').toThrowError(/Invalid/))
    })

    it('#15 Logish log entry: ENTRY', () => {
        expect(() => (new Logish(logishConfig)).entry('entry test').toThrowError(/Invalid/))
    })
})
