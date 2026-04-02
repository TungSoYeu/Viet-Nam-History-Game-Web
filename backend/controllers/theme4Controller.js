const {
  getModeDataKey,
  getTheme4Content,
  replaceTheme4Content,
  syncDefaultTheme4Content,
} = require("../services/theme4ContentService");

exports.getTheme4Content = async (req, res) => {
  try {
    const content = await getTheme4Content();
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: "Unable to load Theme 4 content", error: error.message });
  }
};

exports.getTheme4Modes = async (req, res) => {
  try {
    const content = await getTheme4Content();
    res.json({
      theme: content.theme,
      lessons: content.lessons,
      requirements: content.requirements,
      modes: content.modes || [],
      meta: content.meta || {},
    });
  } catch (error) {
    res.status(500).json({ message: "Unable to load Theme 4 modes", error: error.message });
  }
};

exports.getTheme4Mode = async (req, res) => {
  try {
    const content = await getTheme4Content();
    const mode = (content.modes || []).find((item) => item.id === req.params.modeId);

    if (!mode) {
      return res.status(404).json({ message: "Theme 4 mode not found" });
    }

    const dataKey = getModeDataKey(mode.id);
    const data = dataKey ? content.gameData?.[dataKey] : null;

    res.json({
      theme: content.theme,
      lessons: content.lessons,
      requirements: content.requirements,
      mode,
      dataKey,
      data,
      meta: content.meta || {},
    });
  } catch (error) {
    res.status(500).json({ message: "Unable to load Theme 4 mode", error: error.message });
  }
};

exports.replaceTheme4Content = async (req, res) => {
  try {
    const nextContent = req.body?.content || req.body;

    if (!nextContent || !Array.isArray(nextContent.modes) || !nextContent.gameData) {
      return res.status(400).json({
        message: "Theme 4 content must include modes and gameData",
      });
    }

    const saved = await replaceTheme4Content(nextContent);
    res.json({ success: true, content: saved });
  } catch (error) {
    res.status(500).json({ message: "Unable to save Theme 4 content", error: error.message });
  }
};

exports.syncTheme4Defaults = async (req, res) => {
  try {
    const saved = await syncDefaultTheme4Content();
    res.json({ success: true, content: saved });
  } catch (error) {
    res.status(500).json({ message: "Unable to sync Theme 4 defaults", error: error.message });
  }
};
