const fs = require('fs');
const path = require('path');
const { OpenAI, toFile } = require('openai');
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

    // Convert buffer to a File object
    const file = await toFile(
      req.file.buffer,
      req.file.originalname || 'audio.wav'
    );

    // Step 1: Transcribe to English using Whisper
    const transcription = await openai.audio.translations.create({
      file,
      model: 'whisper-1'
    });

    const englishText = transcription.text;
    console.log("📝 Transcription:", englishText);

    // Step 2: Translate with GPT-4o
    const translationResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: `Translate the following to ${targetLanguage}` },
        { role: 'user', content: englishText }
      ]
    });

    const translatedText = translationResponse.choices[0].message.content.trim();
    console.log("🌐 Translated:", translatedText);

    // Step 3: Convert translated text to speech
    const ttsResponse = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'nova', // You can change voice to: alloy, echo, fable, shimmer, etc.
      input: translatedText,
      response_format: "mp3"
    });

    const audioBuffer = Buffer.from(await ttsResponse.arrayBuffer());

    // Step 4: Token deduction
    await User.findByIdAndUpdate(user._id, {
      $inc: { tokenBalance: -process.env.TOKENS_PER_AUDIO }
    });

    await TokenLog.create({
      user: user._id,
      action: 'audio_translation',
      tokensDeducted: process.env.TOKENS_PER_AUDIO
    });

    // Step 5: Send MP3 response
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', 'attachment; filename="translated.mp3"');
    res.send(audioBuffer);

  } catch (error) {
    console.error('Audio translation error:', error);
    res.status(500).send({ error: error.message });
  }
};