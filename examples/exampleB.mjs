
import { Logish } from './../src/logish.js'



export function exampleB () {
    const log = new Logish()
    log.setNamespace('example:B')

    log.info('Goodbye from exampleB .')
    log.error('Exception or error call')
    log.fatal('Fatal brings down the system')
}
