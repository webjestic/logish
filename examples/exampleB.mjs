
import { Logish } from './../src/logish.js'

export function exampleB () {
    const log = new Logish()
    log.setNamespace('example:B')
    log.info('Log already created once, and will use that configruation.')
}
