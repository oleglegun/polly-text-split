const SOFT_LIMIT = 1000
const HARD_LIMIT = 1500

/**
 * @typedef {Object} TreeNode Tree node that can contain plain text or SSML tag.
 * @property {string} type Type of node: `TEXT` or SSML tag like `prosody`, `speak`.
 * @property {string} value Text value for `TEXT` node or attributes for SSML tag.
 * @property {TreeNode} parentNode Pointer to a parent node.
 */

/**
 * Creates a tree data structure from SSML text.
 * @class
 */
class SSMLParseTree {
    /**
     * Set default character limits.
     * Initialize tree.
     *
     * @param {number} hardLimit
     * @param {number} softLimit
     */
    constructor(hardLimit, softLimit) {
        this._root = {
            parentNode: null,
            type: 'root',
        }
        this._hardLimit = hardLimit
        this._softLimit = softLimit
    }

    /**
     * Adds new tree node as a parentNode child.
     *
     * @param {TreeNode} parentNode
     * @param {TreeNode} newNode
     * @private
     */
    _addNode(parentNode, newNode) {
        if (parentNode.children) {
            parentNode.children.push(newNode)
        } else {
            parentNode.children = [newNode]
        }
    }

    /**
     * Creates tree data structure from SSML text.
     * @param {string} ssml String containing text with SSML tags.
     */
    buildTree(ssml) {
        // remove extra space if needed
        ssml = ssml.trim(ssml)

        let text = ''
        let textHasStarted = false
        let currentNode = this._root

        for (let i = 0, len = ssml.length; i < len; i++) {
            // check if the char is a plain text or SSML tag
            if (ssml[i] === '<') {
                // 1. SSML tag
                // if the text was already started - finish it and add to the parentNode
                if (textHasStarted) {
                    textHasStarted = false

                    const newNode = {
                        parentNode: currentNode,
                        type: 'TEXT',
                        value: text,
                    }

                    this._addNode(currentNode, newNode)
                }

                // type and value/attributes of parsed SSML tag
                let type = ''
                let value = '' // can be blank, like <tag /> or <tag></tag>

                let isEndTag = false // flag for end tag (</tag>)
                let isEmptyTag = false // flag for empty tag (<tag />)

                // start from next char
                let j = i + 1

                // check if it is an end tag (no value)
                if (ssml[j] === '/') {
                    isEndTag = true

                    // start from next char
                    j++

                    // parse only type
                    while (ssml[j] !== '>') {
                        type += ssml[j]
                        j++
                    }
                } else {
                    /*
                     *  1. Parse type
                     *  ' ' - value coming
                     *  '>' - is start tag
                     *  '/' - is empty tag
                     */
                    while (ssml[j] !== ' ' && ssml[j] !== '>' && ssml[j] !== '/') {
                        type += ssml[j]
                        j++
                    }

                    // 2. Parse value
                    while (true) {
                        if (ssml[j] !== '>') {
                            // 1. value continues -> accumulate value
                            value += ssml[j]
                        } else if (ssml[j - 1] === '/') {
                            // 2. empty tag <tag />
                            isEmptyTag = true

                            // remove last `/` char from value
                            if (value.length !== 0) value = value.slice(0, value.length - 1)

                            break
                        } else {
                            // 3. end tag </tag>
                            break
                        }
                        j++
                    }
                }

                /*
                 * Process parsing results
                 */

                if (!isEndTag) {
                    const newLeaf = {
                        parentNode: currentNode,
                        type,
                        value,
                    }
                    this._addNode(currentNode, newLeaf)

                    if (!isEmptyTag) {
                        // Not an empty tag => can have other children
                        currentNode = newLeaf
                    }
                } else {
                    // is end tag
                    if (isEmptyTag) {
                        // empty end tag
                        const newLeaf = {
                            parentNode: currentNode,
                            type,
                            value,
                        }
                        this._addNode(currentNode, newLeaf)
                    } else {
                        // close current tag = no more children
                        // sanity check
                        if (currentNode.type !== type) {
                            const msg = `Incorrect SSML: ${type} !== ${currentNode.type}`
                            throw new Error(msg)
                        }
                        currentNode = currentNode.parentNode
                    }
                }

                // skip processed chars for the next iteration
                i = j
            } else {
                // 2. Plain text
                if (!textHasStarted) {
                    textHasStarted = true
                    text = ''
                }

                // accumulate characters
                text += ssml[i]
            }
        }

        return this._root
    }
}

module.exports = new SSMLParseTree(HARD_LIMIT, SOFT_LIMIT)

