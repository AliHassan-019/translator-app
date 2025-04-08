const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');
const { toFile } = require('openai');
const User = require('../models/User');
const TokenLog = require('../models/TokenLog');
const { Readable } = require('stream');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

exports.translateText = async (req, res) => {
  try {
    const { text, targetLanguage } = req.body;
    const user = req.user;
    
    if (user.tokenBalance < process.env.TOKENS_PER_TEXT) {
      return res.status(400).json({ error: 'Insufficient tokens' });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{
        role: "user",
        content: `Translate this text to ${targetLanguage}: ${text}`
      }]
    });

    await User.findByIdAndUpdate(user._id, { 
      $inc: { tokenBalance: -process.env.TOKENS_PER_TEXT } 
    });
    
    await TokenLog.create({
      user: user._id,
      action: 'text_translation',
      tokensDeducted: process.env.TOKENS_PER_TEXT
    });

    res.json({ translation: response.choices[0].message.content });
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ error: error.message });
  }
};


exports.translateAudio = async (req, res) => {
  try {
    const user = req.user;
    const targetLanguage = req.body.targetLanguage;

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (!targetLanguage) {
      return res.status(400).json({ error: 'Target language is required' });
    }

    if (user.tokenBalance < process.env.TOKENS_PER_AUDIO) {
      return res.status(400).json({ error: 'Insufficient tokens' });
    }

    // Convert buffer to File object using OpenAI's utility
    const file = await toFile(
      req.file.buffer,
      req.file.originalname || 'audio.wav' // fallback name
    );

    // Transcribe with Whisper (audio → English text)
    const whisperResponse = await openai.audio.translations.create({
      file,
      model: 'whisper-1'
    });

    const englishText = whisperResponse.text;

    // Translate with GPT-4
    const gptResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: `Translate the following to ${targetLanguage}` },
        { role: 'user', content: englishText }
      ]
    });

    const translatedText = gptResponse.choices[0].message.content;

    // Deduct tokens
    await User.findByIdAndUpdate(user._id, { $inc: { tokenBalance: -process.env.TOKENS_PER_AUDIO } });
    await TokenLog.create({
      user: user._id,
      action: 'audio_translation',
      tokensDeducted: process.env.TOKENS_PER_AUDIO
    });

    res.json({
      original_text: englishText,
      translated_text: translatedText
    });
  } catch (error) {
    console.error('Audio translation error:', error);
    res.status(500).send({ error: error.message });
  }
};