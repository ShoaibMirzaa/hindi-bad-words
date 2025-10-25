var _ = require("lodash");
var hindiBadWords = require("./data/hindi-bad-words");
var englishBadWords = require("./data/english-bad-words");
var frenchBadWords = require("./data/french-bad-words");
var germanBadWords = require("./data/german-bad-words");
var italianBadWords = require("./data/italian-bad-words");
var spanishBadWords = require("./data/spanish-bad-words");
var badWordsDictionary = {};
var userDefinedWords = {};

var profanity = {};

// Regex to match common emojis at start or end
const emojiRegex =
  /^(?:\p{Emoji_Presentation}|\p{Emoji}\uFE0F)+|(?:\p{Emoji_Presentation}|\p{Emoji}\uFE0F)+$/gu;

function censorWordWithEmoji(word, censorFunc) {
  // 1. Detect emojis at start/end
  const startEmojiMatch = word.match(
    /^(?:\p{Emoji_Presentation}|\p{Emoji}\uFE0F)+/u
  );
  const endEmojiMatch = word.match(
    /(?:\p{Emoji_Presentation}|\p{Emoji}\uFE0F)+$/u
  );

  const startEmoji = startEmojiMatch ? startEmojiMatch[0] : "";
  const endEmoji = endEmojiMatch ? endEmojiMatch[0] : "";

  // 2. Remove emojis from word
  const cleanWord = word.replace(emojiRegex, "");

  // 3. Run your censor function
  const censored = censorFunc(cleanWord);

  // 4. Reattach emojis
  return `${startEmoji}${censored}${endEmoji}`;
}

profanity.maskBadWords = function (message, maskWith, partialCensor) {
  if (!message || typeof message !== "string") {
    throw new Error("message passed to the function must be a string");
  }

  // Regex to detect emojis at start or end of a word
  const emojiRegex =
    /^(?:\p{Emoji_Presentation}|\p{Emoji}\uFE0F)+|(?:\p{Emoji_Presentation}|\p{Emoji}\uFE0F)+$/gu;

  var cleanedMessage = message
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .map(function (word) {
      // 1. Extract start and end emojis
      const startEmojiMatch = word.match(
        /^(?:\p{Emoji_Presentation}|\p{Emoji}\uFE0F)+/u
      );
      const endEmojiMatch = word.match(
        /(?:\p{Emoji_Presentation}|\p{Emoji}\uFE0F)+$/u
      );

      const startEmoji = startEmojiMatch ? startEmojiMatch[0] : "";
      const endEmoji = endEmojiMatch ? endEmojiMatch[0] : "";

      // Remove emojis temporarily
      const cleanWord = word.replace(emojiRegex, "");

      // 2. Run your existing censor logic on cleanWord
      let censoredWord = cleanWord;

      if (profanity.isMessageDirty(cleanWord)) {
        if (maskWith && maskWith !== null && typeof maskWith === "string") {
          if (partialCensor) {
            if (word.length <= 5) {
              censoredWord = cleanWord
                .split("")
                .map((ch, i) => ((i + 1) % 2 === 0 ? maskWith : ch))
                .join("");
            } else {
              censoredWord = cleanWord
                .split("")
                .map((ch, i) => ((i + 1) % 3 === 0 ? maskWith : ch))
                .join("");
            }
          } else {
            return word.replace(/./g, maskWith);
          }
        } else {
          censoredWord = cleanWord.replace(/./g, "*");
        }
      }
      // 3. Reattach emojis
      return `${startEmoji}${censoredWord}${endEmoji}`;
    })
    .join(" ");
  return cleanedMessage;
};

profanity.isMessageDirty = function (message) {
  if (!message || typeof message !== "string") {
    throw new Error("message passed to the function must be a string");
  }
  var messageWords = message.split(" ");
  badWordsDictionary = _.merge(
    germanBadWords,
    hindiBadWords,
    englishBadWords,
    frenchBadWords,
    italianBadWords,
    spanishBadWords,
    userDefinedWords
  );

  badWordsDictionary = _.transform(
    badWordsDictionary,
    function (result, val, key) {
      result[key.toLowerCase()] = val;
    }
  );
  var flag = false;
  for (var i = 0; i < messageWords.length; i++) {
    if (
      badWordsDictionary.hasOwnProperty(messageWords[i].trim().toLowerCase())
    ) {
      flag = true;
      break;
    }
  }
  return flag;
};

var alreadyExists = function (word, wordList) {
  if (!word || !wordList) return false;
  return !!wordList.hasOwnProperty(word);
};

profanity.addWords = function (wordList) {
  if (!wordList) return badWordsDictionary;
  if (
    typeof wordList === "string" &&
    !alreadyExists(wordList, badWordsDictionary)
  ) {
    userDefinedWords[wordList.trim()] = 1;
  }
  if (wordList.constructor === Array) {
    wordList.map(function (word) {
      if (
        typeof word === "string" &&
        !alreadyExists(word, badWordsDictionary)
      ) {
        userDefinedWords[word.trim()] = 1;
      }
    });
  }
  badWordsDictionary = _.merge(badWordsDictionary, userDefinedWords);
  return badWordsDictionary;
};

profanity.removeWords = function (wordList) {
  if (!wordList) return badWordsDictionary;
  if (
    typeof wordList === "string" &&
    alreadyExists(wordList, badWordsDictionary)
  )
    delete badWordsDictionary[wordList.trim()];
  if (wordList.constructor === Array) {
    wordList.map(function (word) {
      if (typeof word === "string" && alreadyExists(word, badWordsDictionary))
        delete badWordsDictionary[word.trim()];
    });
  }
  return badWordsDictionary;
};

module.exports = profanity;
