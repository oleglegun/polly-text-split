class ConfigurationValidationError extends Error {
    /**
     * @param {string} message
     */
    constructor(message) {
        super(message)
        this.name = 'ConfigurationValidationError'
    }
}

module.exports = { ConfigurationValidationError }
