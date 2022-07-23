
import Debug from 'debug'
const debug = Debug('logish:config')



export class Config {

    #json = undefined

    #defaultConfig = {
        levels : Object.freeze({ 'TRACE': 0, 'DEBUG': 1, 'INFO': 2, 'WARN': 3, 'ERROR': 4, 'FATAL': 5 }),
        level : 'INFO',
        controllers : [
            {
                name: 'ControlConsole',
                module : './controlConsole.mjs'
            },
            {
                name: 'ControlFile',
                module : './controlFile.mjs'
            }
        ]
    }

    constructor(config) {
        debug('constructor')
        this.#json = this.#defaultConfig // this.#resolveConstructorArgs(config)
    }

    get json() { return this.#json }

    #resolveConstructorArgs(config) {
        debug('resolveConstructorArgs')
        return config
    }


}
