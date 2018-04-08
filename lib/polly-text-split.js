const SOFT_LIMIT = 1000
const HARD_LIMIT = 1500
const EXTRA_SPLIT_CHARS = ',;'

/**
 *
 */
class TextSplit {
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
        this._softLimit = softLimit
        this._hardLimit = hardLimit

        if (options.extraSplitChars && typeof options.extraSplitChars === 'String') {
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
            return this._batches
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

    splitSSML(ssml) {}
}

module.exports = new TextSplit(SOFT_LIMIT, HARD_LIMIT, EXTRA_SPLIT_CHARS)
