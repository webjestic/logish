
import { getLogish } from './logger.mjs'

const log = getLogish()
log.setNamespace('example:B')

export function exampleB () {
    log.error('Log already created once, and will use that configruation.')
}
