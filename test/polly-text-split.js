const t = require('tap')
const textSplit = require('../lib/polly-text-split')

const options = {
    softLimit: 10,
    hardLimit: 15,
}

const testCasesText = [
    {
        options,
        text: 'Simple text. Simple text.',
        result: ['Simple text.', ' Simple text.'],
    },
    {
        text: 'Simple text, simple text.',
        result: ['Simple text,', ' simple text.'],
    },
    {
        text: 'Simple text; simple text.',
        result: ['Simple text;', ' simple text.'],
    },
    {
        text: 'Simple text simple text.',
        result: ['Simple text', 'simple text.'],
    },
    {
        text: 'Simple textsimple text.',
        result: ['Simple text', 'simple text.'],
    },
]

testCasesText.forEach(test => {
    if (test.options) {
        textSplit.configure(test.options)
    }

    t.same(textSplit.splitText(test.text), test.result)
})
