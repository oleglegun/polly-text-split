const SOFT_LIMIT = 2
const HARD_LIMIT = 4
const EXTRA_SPLIT_CHARS = ',;'

class TextSplit {
    constructor() {
        this.batches = []
    }

    configure(type) {
        this.type = type
    }

    /**
     * Splits text for batches of <1500 chars.
     * @param {string} text Text input for splitting.
     * @returns {Array}
     */
    splitText(text) {
        if (text.length < HARD_LIMIT) {
            this.batches.push(text)
            return this.batches
        }

        let i = HARD_LIMIT
        let splitIdx

        while (i > SOFT_LIMIT) {
            // search for .
            if (text[i] === '.') {
                // found - split here
                this.batches.push(text.slice(0, i + 1))
                splitIdx = i
                break
            }

            i--
        }

        if (!splitIdx) {
            // no . found - check for other split chars
            i = HARD_LIMIT
            while (i > SOFT_LIMIT) {
                if (EXTRA_SPLIT_CHARS.indexOf(text[i]) !== -1) {
                    // found - split here
                    this.batches.push(text.slice(0, i + 1))
                    splitIdx = i
                    break
                }
                i--
            }

            if (!splitIdx) {
                // no split chars found - split by nearest space char
                i = HARD_LIMIT
                while (i > SOFT_LIMIT) {
                    if (' \t\n\r\v'.indexOf(text[i]) !== -1) {
                        // found - split here, discard space char
                        this.batches.push(text.slice(0, i))
                        splitIdx = i
                        break
                    }
                    i--
                }
            }

            if (!splitIdx) {
                // hard split
                this.batches.push(text.slice(0, SOFT_LIMIT + 1))
                splitIdx = i
            }
        }

        return this.splitText(text.slice(splitIdx + 1))
    }

    splitSSML(ssml) {

    }
}

module.exports = new TextSplit()