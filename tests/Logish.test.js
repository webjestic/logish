const Log = require('../src/classes/Logish')

test('new Logish without params to throw an error.', () => {

    const log = () => { new Log() }
    expect(log).toThrow(Error)
    expect(log).toThrow('No config proivded.')
    
})

test('new Logish with empty config, returns default config.', () => {

    const log = new Log({})
    expect(log.config.log_level).toBe('INFO')
    expect(log.config.debugging.log_perf_hooks).toBe(true)
    expect(log.config.debugging.log_only_namespace).toBe(false)
    expect(log.config.console.use_colors).toBe(true)
})

test('new Logish with empty config and a namespace.', () => {

    const log = new Log({}, 'logish:tests')
    expect(log.namespace).toBe('logish:tests')
})

test('new Logish with empty config and a namespace.', () => {

    const log = new Log({}, 'logish:tests')
    expect(log.info('test')).toBe()
})
