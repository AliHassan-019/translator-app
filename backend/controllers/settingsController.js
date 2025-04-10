// backend/controllers/settingsController.js
const Setting = require('../models/Setting');

exports.getOpenaiKey = async (req, res) => {
  try {
    let setting = await Setting.findOne();
    if (!setting) {
      // Create a new record with default API key from env if not present
      setting = new Setting({ openaiApiKey: process.env.OPENAI_API_KEY });
      await setting.save();
    }
    res.json({ openaiApiKey: setting.openaiApiKey });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateOpenaiKey = async (req, res) => {
  try {
    const { newApiKey } = req.body;
    let setting = await Setting.findOne();
    if (!setting) {
      setting = new Setting({ openaiApiKey: newApiKey });
    } else {
      setting.openaiApiKey = newApiKey;
    }
    await setting.save();
    // If you’re using a long–lived OpenAI client instance, you might update it here.
    res.json({ openaiApiKey: setting.openaiApiKey });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
