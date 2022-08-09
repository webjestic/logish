
import Debug from 'debug'
const debug = Debug('logish:config')



/**
 * Responsible for ensuring the integrity of the logish configuration.
 * Creating, updating, validating and reconciliation.
 */
export class Config {

    #configDefaultSchema = {
        levels: Object.freeze({ 'TRACE': 0, 'DEBUG': 1, 'INFO': 2, 'WARN': 3, 'ERROR': 4, 'FATAL': 5 }),
        level : 'trace',
        performanceTime : true,
        controllers : []
    }

    #levelsdef = this.#configDefaultSchema.levels
    #json = null

    /** Pattern: Singleton */
    constructor(configJSON) {
        debug('constructor')

        if (!Config.instance) {
            if (!this.configure(configJSON))
                throw new Error('Unable to create instance - no validated configuration available.')
            else
                Config.instance = this
        }
        return Config.instance
    }
    
    getInstance() { return Config.instance }
    getConfig() { return this.#json }
    getLevels() { return this.#levelsdef }
    get json() { return this.#json }

    /**
     * 
     * @param {object} configJSON 
     * @returns boolean
     */
    configure(customConfig) {
        debug('configure')
        //debug('configJSON %O', configJSON)

        let result = false
        if (customConfig !== undefined && typeof customConfig === 'object') {
            if (this.validate(customConfig)) {
                this.#json = this.#configDefaultSchema
                this.#assignConfigValues(customConfig)
                result = true
            }
        } else {
            // completely assign default values to the configuration
            this.#json = this.#configDefaultSchema
            this.#assignConfigValues(this.#configDefaultSchema)
            result = true
        }
        return result
    }

    /**
     * 
     * @param {object} customConfig 
     * @returns boolean
     */
    validate(customConfig) {
        debug('validate')

        // customConfig is validated to be typeof object by this.configure at this point

        if ( customConfig.level !== undefined && typeof customConfig.level === 'string') {
            if (this.#configDefaultSchema.levels[customConfig.level.toUpperCase()] === undefined)
                throw new Error('Provided config.level is not a valid logish level.')
        } else 
            throw new Error('Provided config.level is not typeof "string".')

        if (customConfig.performanceTime !== undefined && typeof customConfig.performanceTime !== 'boolean') 
            throw new Error('Provided config.performanceTime is not typeof "boolean".')
        
        if (customConfig.controllers !== undefined && typeof customConfig.controllers === 'object') {
            if (!Array.isArray(customConfig.controllers))
                throw new Error('Provided config.controllers is not typeof "array".')

        } else
            throw new Error('Provided config.controllers is not typeof "object".')

        // cannot and should not validate controller specific configurations.
        // this needs to be handled within the controller itself. this validation
        // action is handled within the controller constructor. therefore, if we 
        // are here, then the validation for config is complete.

        // if controllers are provided in customConfig, then assign the controllers

        return true
    }

    /**
     * 
     * @param {*} customConfig 
     */
    #assignConfigValues(customConfig) {
        debug('assignConfigValues')

        if (customConfig.level !== undefined) this.json.level = customConfig.level
        else this.json.level = this.#configDefaultSchema.level

        if (customConfig.performanceTime !== undefined) this.json.performanceTime = customConfig.performanceTime
        else this.json.performanceTime = this.#configDefaultSchema.performanceTime

        if (customConfig.controllers !== undefined) this.json.controllers = customConfig.controllers
        else this.json.controllers = this.#configDefaultSchema.controllers

        if (this.json.controllers.length <= 0) {
            customConfig.controllers.push( { name: 'console' } )
            customConfig.controllers.push( { name: 'file', files: [] } )
        }
        
        // assign default module and class name for controller CONSOLE and FILE
        for (let customController of customConfig.controllers) {
            if (customController.name !== undefined && typeof customController.name === 'string') {
                if (customController.name.toLowerCase() === 'console') {
                    customController.classname = 'ControlConsole'
                    customController.module = './controlConsole.mjs'
                }
                if (customController.name.toLowerCase() === 'file') {
                    customController.classname = 'ControlFile'
                    customController.module = './controlFile.mjs' 
                }
            } else
                throw new Error ('Config.controllers[index].name is required.')
        }

        debug ('config %O', this.json)
    }
}
