const text = ``

const SOFT_LIMIT = 10
const HARD_LIMIT = 15

class SSMLParseTree {
    constructor(hardLimit, softLimit) {
        this._tree = {
            topNode: null,
            type: 'head',
        }
        this._hardLimit = hardLimit
        this._softLimit = softLimit
    }

    addLeaf(node, leaf) {
        if (node.leaves) {
            node.leaves.push(leaf)
        } else {
            node.leaves = [leaf]
        }
    }

    /**
     *
     * @param {string} ssml
     */
    buildTree(ssml) {
        ssml = ssml.trim(ssml)
        let plain = ''
        let textStart = false
        let currentNode = this._tree
        for (let i = 0, len = ssml.length; i < len; i++) {
            if (ssml[i] === '<') {
                if (textStart) {
                    // add Text node
                    const newLeaf = {
                        topNode: currentNode,
                        type: 'TEXT',
                        value: plain,
                    }
                    this.addLeaf(currentNode, newLeaf)
                    textStart = false
                }
                // SSML tag
                let j = i + 1
                // console.log('-', plain)
                plain = ''
                // let tag = {}
                let type = ''
                let value = ''
                let closingTag = false
                let singleTag = false

                // check if it is a closing tag (no value)
                if (ssml[j] === '/') {
                    closingTag = true

                    // parse only type
                    while (true) {
                        j++
                        if (ssml[j] !== '>') {
                            type += ssml[j]
                        } else {
                            break
                        }
                    }
                } else {
                    // parse type + value
                    while (true) {
                        if (ssml[j] !== ' ' && ssml[j] !== '>' && ssml[j] !== '/') {
                            type += ssml[j]
                        } else {
                            break
                        }
                        j++
                    }

                    // parse value
                    while (true) {
                        if (ssml[j] !== '>') {
                            // still value
                            // accumulate value
                            value += ssml[j]
                        } else {
                            // tag ending

                            if (ssml[j - 1] === '/') {
                                // single tag < />
                                singleTag = true

                                // remove last `/` char from value
                                if (value.length !== 0) {
                                    value = value.slice(0, value.length - 1)
                                }
                            } else {
                                // double tag <> </>
                                // currentNode = currentNode.topNode
                            }

                            // i = j

                            break
                        }
                        j++
                    }
                }
                i = j

                if (!closingTag) {
                    const newLeaf = {
                        topNode: currentNode,
                        type,
                        value,
                    }
                    this.addLeaf(currentNode, newLeaf)

                    if (!singleTag) {
                        // can be other leaves
                        currentNode = newLeaf
                    }

                    // console.log('--- type:', type)
                    // console.log('--- value:', value)
                } else {
                    if (singleTag) {
                        const newLeaf = {
                            topNode: currentNode,
                            type,
                            value,
                        }
                        this.addLeaf(currentNode, newLeaf)

                        currentNode
                    } else {
                        // close current tag = no more leaves
                        if (currentNode.type === type) {
                            currentNode = currentNode.topNode
                        } else {
                            const message = `Incorrect SSML: ${type} !== ${currentNode.type}`
                            throw new Error(message)
                        }
                    }
                    // console.log('--- close:', type)
                }
            } else {
                // plain text
                if (!textStart) {
                    textStart = true
                }

                plain += ssml[i]

                // parse plain text
            }
        }
        console.log('---')
    }
}

const tree = new SSMLParseTree(HARD_LIMIT, SOFT_LIMIT).buildTree(text)
