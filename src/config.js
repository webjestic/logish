

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

    #json = null

    /** Pattern: Singleton */
    constructor(configJSON) {

        // if (!Config.instance) {
        //     if (!this.#configure(configJSON))
        //         throw new Error('Unable to create instance - no validated configuration available.')
        //     else
        //         Config.instance = this
        // } else {
        //     if (configJSON !== undefined)
        //         this.setConfig(configJSON)
        // }
        // return Config.instance

        this.#configure(configJSON)
    }
    
    getInstance() { return Config.instance }

    get json() { return this.#json }
    set json(value) { this.#json = value }

    /** */
    getLevel() { return this.#json.level }
    /** */
    setLevel(value) { 
        if (this.#json.levels[value.toUpperCase()] !== undefined) 
            this.#json.level = value
    }
    /** */
    getConfig() { return this.#json }
    /** */
    setConfig(value) { 
        if (value !== undefined && typeof value === 'object')
            this.#configure(value)
        else 
            throw new Error ('Logish.setConfig() value is not a  alid object.')
    } 

    /**
     * 
     * @param {object} configJSON 
     * @returns boolean
     */
    #configure(customConfig) {
        //debug('configJSON %O', configJSON)

        let result = false
        if (customConfig !== undefined && typeof customConfig === 'object') {
            if (this.#validate(customConfig)) {
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
     * Validates undefined and typeof
     * 
     * @param {object} customConfig 
     * @returns boolean
     */
    #validate(customConfig) {

        // customConfig is validated to be typeof object by this.configure at this point

        if ( customConfig.level !== undefined && typeof customConfig.level === 'string') {
            if (this.#configDefaultSchema.levels[customConfig.level.toUpperCase()] === undefined)
                throw new Error('Provided config.level is not a valid logish level.')
        } else 
            throw new Error('Provided config.level is not typeof "string".')

        if (customConfig.performanceTime !== undefined && typeof customConfig.performanceTime !== 'boolean') 
            throw new Error('Provided config.performanceTime is not typeof "boolean".')
        
        if (customConfig.controllers !== undefined) {
            if (typeof customConfig.controllers === 'object') {
                if (!Array.isArray(customConfig.controllers))
                    throw new Error('Provided config.controllers is not typeof "array".')
            } else 
                throw new Error('Provided config.controllers is not typeof "object".')
        }


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

        if (customConfig.level !== undefined) this.json.level = customConfig.level
        else this.json.level = this.#configDefaultSchema.level

        if (customConfig.performanceTime !== undefined) this.json.performanceTime = customConfig.performanceTime
        else this.json.performanceTime = this.#configDefaultSchema.performanceTime

        if (customConfig.controllers !== undefined) this.json.controllers = customConfig.controllers
        else this.json.controllers = this.#configDefaultSchema.controllers

        if (this.json.controllers.length <= 0) {
            this.json.controllers.push( { name: 'console' } )
            this.json.controllers.push( { name: 'file', files: [] } )
        }
    }
}
