
import Logish from '../src/index.js'


export function exampleB () {
    const log = new Logish()
    log.setNamespace('example:B')

    log.info('Goodbye from exampleB .')
    log.error('Exception or error call')
    log.fatal('Fatal brings down the system')
}
