
import { Logish } from './../src/logish.js'


export function exampleA () {
    const log = new Logish()
    log.setNamespace('example:A')
    log.warn('Warning from A.')
    log.info('Hello from examcpleA.')
}
