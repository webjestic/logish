
import tap from 'tap'
import { Logish } from '../src/logish.js'
import fs from 'fs'
import os from 'os'
import path from 'path'

tap.pass('tap test')

const makeConfig = (logFile, writeLevels = ['info', 'warn', 'error']) => ({
    level: 'trace',
    controllers: [
        {
            name: 'file',
            files: [
                {
                    title: 'test',
                    active: true,
                    writeLevels,
                    format: '[%datetime %level] %entry',
                    filename: logFile,
                    maxsize_in_mb: 1,
                    backups_kept: 1,
                    gzip_backups: false
                }
            ]
        }
    ]
})

tap.test('file controller creates log file and writes entry', (t) => {
    const logDir = path.join(os.tmpdir(), `logish-test-${Date.now()}`)
    const logFile = path.join(logDir, 'test.log')

    const log = new Logish(makeConfig(logFile))
    log.info('smoke test message')

    t.ok(fs.existsSync(logFile), 'log file was created')
    t.match(fs.readFileSync(logFile, 'utf8'), 'smoke test message')

    fs.rmSync(logDir, { recursive: true })
    t.end()
})

tap.test('file controller respects writeLevels', (t) => {
    const logDir = path.join(os.tmpdir(), `logish-test-${Date.now() + 1}`)
    const logFile = path.join(logDir, 'test.log')

    const log = new Logish(makeConfig(logFile, ['error']))
    log.info('should not appear')
    log.error('should appear')

    t.ok(fs.existsSync(logFile), 'log file was created')
    const contents = fs.readFileSync(logFile, 'utf8')
    t.notMatch(contents, 'should not appear')
    t.match(contents, 'should appear')

    fs.rmSync(logDir, { recursive: true })
    t.end()
})

tap.test('file controller inactive flag skips writing', (t) => {
    const logDir = path.join(os.tmpdir(), `logish-test-${Date.now() + 2}`)
    const logFile = path.join(logDir, 'test.log')

    const log = new Logish({
        level: 'trace',
        controllers: [
            {
                name: 'file',
                active: false,
                files: []
            }
        ]
    })
    log.info('should not be written')

    t.notOk(fs.existsSync(logFile), 'log file was not created')
    t.end()
})
