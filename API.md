<a name="TextSplit"></a>

## TextSplit
Splits text for batches.

**Kind**: global class  

* [TextSplit](#TextSplit)
    * [new TextSplit(softLimit, hardLimit, extraSplitChars)](#new_TextSplit_new)
    * [.configure(options)](#TextSplit+configure)
    * [.split(text)](#TextSplit+split) ⇒ <code>Array.&lt;string&gt;</code>
    * [.splitIndex(text)](#TextSplit+splitIndex) ⇒ <code>number</code>

<a name="new_TextSplit_new"></a>

### new TextSplit(softLimit, hardLimit, extraSplitChars)
Set default character limits.
Initialize array for separated batches.


| Param | Type |
| --- | --- |
| softLimit | <code>number</code> | 
| hardLimit | <code>number</code> | 
| extraSplitChars | <code>string</code> | 

<a name="TextSplit+configure"></a>

### textSplit.configure(options)
Set configuration options.
This is optional. Default options are perfect for working with AWS Polly TTS.

**Kind**: instance method of [<code>TextSplit</code>](#TextSplit)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | Object with configuration options. |
| options.softLimit | <code>number</code> | <code>1000</code> | Limit of a min batch size. |
| options.hardLimit | <code>number</code> | <code>1500</code> | Limit of a max possible batch size. |
| [options.extraSplitChars] | <code>string</code> | <code>&quot;,;&quot;</code> | String with characters, that can be used as split markers. Optional parameter. |

<a name="TextSplit+split"></a>

### textSplit.split(text) ⇒ <code>Array.&lt;string&gt;</code>
Splits text for batches of <=1500 chars or of custom size set by configure().

**Kind**: instance method of [<code>TextSplit</code>](#TextSplit)  
**Returns**: <code>Array.&lt;string&gt;</code> - Array with text batches.  

| Param | Type | Description |
| --- | --- | --- |
| text | <code>string</code> | Text input for splitting. |

<a name="TextSplit+splitIndex"></a>

### textSplit.splitIndex(text) ⇒ <code>number</code>
Search for possible split text index.

**Kind**: instance method of [<code>TextSplit</code>](#TextSplit)  
**Returns**: <code>number</code> - Position (index of `text` array) for possible split (including).  

| Param | Type | Description |
| --- | --- | --- |
| text | <code>string</code> | Text input for searching for split position. |

