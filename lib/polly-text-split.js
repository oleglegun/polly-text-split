const { ValidationError, SSMLParseError } = require('./errors')

const SOFT_LIMIT = 1000
const HARD_LIMIT = 1500
const EXTRA_SPLIT_CHARS = ',;'

/**
 * @class
 * @constructor
 */

class TextSplit {
    /**
     *
     * @param {number} softLimit
     * @param {number} hardLimit
     * @param {string} extraSplitChars
     */
    constructor(softLimit, hardLimit, extraSplitChars) {
        
        this._batches = []
        this._softLimit = softLimit
        this._hardLimit = hardLimit
        this._extraSplitChars = extraSplitChars
    }

    /**
     *
     * @param {Object} options
     * @param {number=1000} options.softLimit
     * @param {number=1500} options.hardLimit
     * @param {string=",;"} options.extraSplitChars
     */
    configure(options) {

        if (!options) {
            throw new ValidationError("Parameter `options` is missing.")
        }

        if (typeof options !== 'object') {
            throw new ValidationError("Parameter `options` must be an object.")
        }
        this._softLimit = options.softLimit
        this._hardLimit = options.hardLimit

        if (options.extraSplitChars && typeof options.extraSplitChars === 'string') {
            this._extraSplitChars = options.extraSplitChars
        }
    }

    /**
     * Splits text for batches of <1500 chars.
     * @param {string} text Text input for splitting.
     * @returns {Array}
     */
    splitText(text) {
        if (text.length < this._hardLimit) {
            this._batches.push(text)
            const result = this._batches.slice(0)
            this._batches = []
            return result
        }

        let i = this._hardLimit
        let splitIdx

        while (i > this._softLimit) {
            // search for .
            if (text[i] === '.') {
                // found - split here
                this._batches.push(text.slice(0, i + 1))
                splitIdx = i
                break
            }

            i--
        }

        if (!splitIdx) {
            // no . found - check for other split chars
            i = this._hardLimit
            while (i > this._softLimit) {
                if (this._extraSplitChars.indexOf(text[i]) !== -1) {
                    // found - split here
                    this._batches.push(text.slice(0, i + 1))
                    splitIdx = i
                    break
                }
                i--
            }

            if (!splitIdx) {
                // no split chars found - split by nearest space char
                i = this._hardLimit
                while (i > this._softLimit) {
                    if (' \t\n\r\v'.indexOf(text[i]) !== -1) {
                        // found - split here, discard space char
                        this._batches.push(text.slice(0, i))
                        splitIdx = i
                        break
                    }
                    i--
                }
            }

            if (!splitIdx) {
                // hard split
                this._batches.push(text.slice(0, this._softLimit + 1))
                splitIdx = i
            }
        }

        return this.splitText(text.slice(splitIdx + 1))
    }

    /**
     * 
     * @param {string} ssml String with SSML tags.
     */
    splitSSML(ssml) {

        if (ssml.match(/<speak>/)) {
            
        }
        let openedTags = 0


        // while(true) {

        // }

    }

    _splitSSML(ssml) {

    }
}

module.exports = new TextSplit(SOFT_LIMIT, HARD_LIMIT, EXTRA_SPLIT_CHARS)
