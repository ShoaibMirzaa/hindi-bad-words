# hindi-bad-words

### Author

**Shoaib Mirza**

A small Node.js module for detecting and cleaning profanity in **Hindi**, **English**, **French**, **German**, **Italian** and **Spanish**.

It provides functionalities to **detect bad words**, **mask them**, and supports **partial censoring with emojis**.

**Technologies used:** Node.js

---

## Installation

Install via npm:

```bash
npm install hindi-bad-words
```

### Requirements

It internally uses lodash , will be automatically installed

## Usage

## Importing the module

```javascript
import profanity from "hindi-bad-words";
```

## Code Example

### Masking Bad Words

```javascript
function maskBadWords()
import profanity from "hindi-bad-words";
let message = "hi asshole you are a bitch chutiya";
let cleaned = profanity.maskBadWords(message);
console.log(cleaned); // hi ******* you are a ***** *******
```

### Partial Censor (Works with Emojis)

```javascript
function maskBadWords()
import profanity from "hindi-bad-words";
let message = "hi asshole you are a bitch chutiya😤😱😱";
let cleaned = profanity.maskBadWords(message, "*", true); // Make this true and
console.log(cleaned); // hi as*ho*e you are a b*t*h ch*ti*a😤😱😱
```

- **maskWith**: _Optional_. Character to mask with (default `"*"`).
- **partialCensor**: _Optional boolean_. If `true`, partially censors the word based on length.

### Checking for Bad Words

```javascript
function isMessageDirty()
import profanity from "hindi-bad-words";
let message = "hi asshole you are a bitch chutiya";
let isDirty = profanity.isMessageDirty(message);
console.log(isDirty);
// prints true

let message = "hi there. How are you";
let isDirty = profanity.isMessageDirty(message);
console.log(isDirty);
// prints false
```

### Adding Words to the Dictionary

```javascript
function addWords()
import profanity from "hindi-bad-words";
 let newWords = ["this", "dumbness"];
 profanity.addWords(newWords); // this will add the new words
 to the dictionary of bad words. This function optionally
 returns the entire dictionary of bad words.
```

### Removing Words from the Dictionary

```javascript
function removeWords()
import profanity from "hindi-bad-words";
 let newWords = ["this", "dumbness"];
 profanity.removeWords(newWords); // this will remove the new words
 from the dictionary of bad words. This function optionally
 returns the entire dictionary of bad words.
```

### Full Emoji Support

This module supports words with emojis attached at the start or end. Emojis are temporarily removed during censoring and reattached afterward.

```javascript
let message = "😤asshole😱";
let cleaned = profanity.maskBadWords(message, "*", true);
console.log(cleaned);
// Output: 😤as*ho*e😱
```

### Contributors

Shoaib Mirza

### License

MIT License
