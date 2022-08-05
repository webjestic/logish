
import Logish from '../src/index.js'


export function exampleA () {
    const log = new Logish()
    log.setNamespace('example:A')
    log.info('Hello from examcpleA.')
}
