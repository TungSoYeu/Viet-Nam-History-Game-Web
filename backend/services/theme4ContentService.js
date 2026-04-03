const Theme4Content = require("../models/Theme4Content");
const { theme4Content } = require("../data/theme4DefaultContent");
const { randomUUID } = require("crypto");

const THEME4_SINGLETON_KEY = "theme4";
const SINGLE_VALUE_MODE_IDS = new Set(["historical-flow"]);

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

function ensureModeItemAdminId(item) {
  if (!item || typeof item !== "object" || Array.isArray(item)) {
    return item;
  }

  if (!item._adminId) {
    item._adminId = randomUUID();
  }

  return item;
}

function ensureAllModeItemAdminIds(gameData) {
  Object.values(modeDataKeys).forEach((dataKey) => {
    const modeValue = gameData[dataKey];

    if (Array.isArray(modeValue)) {
      gameData[dataKey] = modeValue.map((item) => ensureModeItemAdminId(item));
      return;
    }

    if (modeValue && typeof modeValue === "object") {
      gameData[dataKey] = ensureModeItemAdminId(modeValue);
    }
  });
}

function normalizeTheme4Content(content) {
  const normalized = JSON.parse(JSON.stringify(content || {}));
  const gameData = normalized.gameData || {};
  const hasHistoricalFlowSet = Object.prototype.hasOwnProperty.call(
    gameData,
    "historicalFlowSet"
  );

  if (hasHistoricalFlowSet && gameData.historicalFlowSet == null) {
    gameData.historicalFlowSets = [];
  }

  if (gameData.historicalFlowSet && !Array.isArray(gameData.historicalFlowSets)) {
    gameData.historicalFlowSets = [gameData.historicalFlowSet];
  }

  if (
    !hasHistoricalFlowSet &&
    !gameData.historicalFlowSet &&
    Array.isArray(gameData.historicalFlowSets) &&
    gameData.historicalFlowSets[0]
  ) {
    gameData.historicalFlowSet = gameData.historicalFlowSets[0];
  }

  if (gameData.historicalFlowSet) {
    if (!Array.isArray(gameData.historicalFlowSets)) {
      gameData.historicalFlowSets = [];
    }

    if (gameData.historicalFlowSets.length === 0) {
      gameData.historicalFlowSets.push(gameData.historicalFlowSet);
    } else {
      gameData.historicalFlowSets[0] = gameData.historicalFlowSet;
    }
  }

  ensureAllModeItemAdminIds(gameData);
  normalized.gameData = gameData;
  return normalized;
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
  const normalizedContent = normalizeTheme4Content(content);
  const saved = await Theme4Content.findOneAndUpdate(
    { singletonKey: THEME4_SINGLETON_KEY },
    {
      singletonKey: THEME4_SINGLETON_KEY,
      content: normalizedContent,
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

async function getTheme4ContentForWrite() {
  const document = await Theme4Content.findOne({
    singletonKey: THEME4_SINGLETON_KEY,
  }).lean();

  if (document?.content) {
    return normalizeTheme4Content(document.content);
  }

  return normalizeTheme4Content(cloneDefaultContent());
}

function getModeItems(content, modeId) {
  const dataKey = getModeDataKey(modeId);

  if (!dataKey) {
    return [];
  }

  const modeValue = content?.gameData?.[dataKey];

  if (Array.isArray(modeValue)) {
    return modeValue;
  }

  if (modeValue && typeof modeValue === "object") {
    return [modeValue];
  }

  return [];
}

async function createTheme4ModeItem(modeId, item) {
  const dataKey = getModeDataKey(modeId);

  if (!dataKey) {
    throw new Error("Theme 4 mode không hợp lệ.");
  }

  const content = await getTheme4ContentForWrite();
  const nextItem = ensureModeItemAdminId(JSON.parse(JSON.stringify(item || {})));

  if (SINGLE_VALUE_MODE_IDS.has(modeId)) {
    content.gameData[dataKey] = nextItem;
  } else {
    const currentItems = Array.isArray(content.gameData[dataKey])
      ? [...content.gameData[dataKey]]
      : [];
    currentItems.push(nextItem);
    content.gameData[dataKey] = currentItems;
  }

  const savedContent = await replaceTheme4Content(content);
  const savedItems = getModeItems(savedContent, modeId);

  return savedItems.find((savedItem) => savedItem._adminId === nextItem._adminId) || nextItem;
}

async function updateTheme4ModeItem(modeId, itemId, item) {
  const dataKey = getModeDataKey(modeId);

  if (!dataKey) {
    throw new Error("Theme 4 mode không hợp lệ.");
  }

  const content = await getTheme4ContentForWrite();
  const nextItem = ensureModeItemAdminId({
    ...(JSON.parse(JSON.stringify(item || {}))),
    _adminId: itemId,
  });

  if (SINGLE_VALUE_MODE_IDS.has(modeId)) {
    const currentItem = content.gameData[dataKey];
    if (!currentItem || currentItem._adminId !== itemId) {
      throw new Error("Không tìm thấy dữ liệu để cập nhật.");
    }

    content.gameData[dataKey] = nextItem;
  } else {
    const currentItems = Array.isArray(content.gameData[dataKey])
      ? [...content.gameData[dataKey]]
      : [];
    const targetIndex = currentItems.findIndex(
      (existingItem) => existingItem?._adminId === itemId
    );

    if (targetIndex === -1) {
      throw new Error("Không tìm thấy dữ liệu để cập nhật.");
    }

    currentItems[targetIndex] = nextItem;
    content.gameData[dataKey] = currentItems;
  }

  const savedContent = await replaceTheme4Content(content);
  const savedItems = getModeItems(savedContent, modeId);

  return savedItems.find((savedItem) => savedItem._adminId === itemId) || nextItem;
}

async function deleteTheme4ModeItem(modeId, itemId) {
  const dataKey = getModeDataKey(modeId);

  if (!dataKey) {
    throw new Error("Theme 4 mode không hợp lệ.");
  }

  const content = await getTheme4ContentForWrite();

  if (SINGLE_VALUE_MODE_IDS.has(modeId)) {
    const currentItem = content.gameData[dataKey];

    if (!currentItem || currentItem._adminId !== itemId) {
      throw new Error("Không tìm thấy dữ liệu để xóa.");
    }

    content.gameData[dataKey] = null;
  } else {
    const currentItems = Array.isArray(content.gameData[dataKey])
      ? [...content.gameData[dataKey]]
      : [];
    const nextItems = currentItems.filter(
      (existingItem) => existingItem?._adminId !== itemId
    );

    if (nextItems.length === currentItems.length) {
      throw new Error("Không tìm thấy dữ liệu để xóa.");
    }

    content.gameData[dataKey] = nextItems;
  }

  const savedContent = await replaceTheme4Content(content);
  return getModeItems(savedContent, modeId);
}

module.exports = {
  createTheme4ModeItem,
  deleteTheme4ModeItem,
  getModeItems,
  getTheme4Content,
  getTheme4ContentForWrite,
  getModeDataKey,
  modeDataKeys,
  normalizeTheme4Content,
  replaceTheme4Content,
  syncDefaultTheme4Content,
  updateTheme4ModeItem,
};
