const Theme4Content = require("../models/Theme4Content");
const { theme4Content } = require("../data/theme4DefaultContent");

const THEME4_SINGLETON_KEY = "theme4";

const modeDataKeys = {
  "turning-page": "revealPictureSets",
  "understanding-teammates": "teammatePackages",
  "historical-recognition": "historicalRecognitionItems",
  "connecting-history": "connectingHistoryRounds",
  "crossword-decoding": "crosswordSets",
  "historical-flow": "historicalFlowSet",
  "lightning-fast": "lightningFastQuestions",
  "picture-puzzle": "picturePuzzleItems",
};

function cloneDefaultContent() {
  return JSON.parse(JSON.stringify(theme4Content));
}

async function getTheme4Content() {
  const document = await Theme4Content.findOne({
    singletonKey: THEME4_SINGLETON_KEY,
  }).lean();

  if (document?.content) {
    return {
      ...document.content,
      meta: {
        ...(document.content.meta || {}),
        source: "database",
        updatedAt: document.updatedAt,
      },
    };
  }

  const fallback = cloneDefaultContent();
  fallback.meta = {
    ...(fallback.meta || {}),
    source: "default",
  };

  return fallback;
}

async function replaceTheme4Content(content) {
  const saved = await Theme4Content.findOneAndUpdate(
    { singletonKey: THEME4_SINGLETON_KEY },
    {
      singletonKey: THEME4_SINGLETON_KEY,
      content,
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  ).lean();

  return saved.content;
}

async function syncDefaultTheme4Content() {
  return replaceTheme4Content(cloneDefaultContent());
}

function getModeDataKey(modeId) {
  return modeDataKeys[modeId] || null;
}

module.exports = {
  getTheme4Content,
  getModeDataKey,
  modeDataKeys,
  replaceTheme4Content,
  syncDefaultTheme4Content,
};
