// backend/controllers/translationController.js

const { OpenAI } = require('openai');
const User = require('../models/User');
const TokenLog = require('../models/TokenLog');
const Setting = require('../models/Setting');

exports.translateText = async (req, res) => {
  try {
    const { text, targetLanguage } = req.body;
    const user = req.user;
    
    if (user.tokenBalance < Number(process.env.TOKENS_PER_TEXT)) {
      return res.status(400).json({ error: 'Insufficient tokens' });
    }
    
    // Dynamically fetch OpenAI API key from settings or fallback to process.env
    let setting = await Setting.findOne();
    const apiKey = setting ? setting.openaiApiKey : process.env.OPENAI_API_KEY;
    const openai = new OpenAI({ apiKey });

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: `Translate this text to ${targetLanguage}: ${text}`
        }
      ]
    });

    // Deduct tokens and record the transaction
    await User.findByIdAndUpdate(user._id, { 
      $inc: { tokenBalance: -Number(process.env.TOKENS_PER_TEXT) } 
    });
    
    await TokenLog.create({
      user: user._id,
      action: 'text_translation',
      tokensDeducted: Number(process.env.TOKENS_PER_TEXT)
    });

    res.json({ translation: response.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.translateAudio = async (req, res) => {
  try {
    const user = req.user;
    
    if (user.tokenBalance < Number(process.env.TOKENS_PER_AUDIO)) {
      return res.status(400).send({ error: 'Insufficient tokens' });
    }
    
    // Dynamically fetch OpenAI API key from settings or fallback to process.env
    let setting = await Setting.findOne();
    const apiKey = setting ? setting.openaiApiKey : process.env.OPENAI_API_KEY;
    const openai = new OpenAI({ apiKey });

    const transcription = await openai.audio.transcriptions.create({
      file: req.file.buffer,
      model: "whisper-1"
    });

    await User.findByIdAndUpdate(user._id, { 
      $inc: { tokenBalance: -Number(process.env.TOKENS_PER_AUDIO) } 
    });
    await TokenLog.create({
      user: user._id,
      action: 'audio_translation',
      tokensDeducted: Number(process.env.TOKENS_PER_AUDIO)
    });

    res.send({ transcription: transcription.text });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
