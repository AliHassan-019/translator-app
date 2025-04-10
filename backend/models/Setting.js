// backend/models/Setting.js
const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  openaiApiKey: { type: String, required: true }
});

module.exports = mongoose.model('Setting', settingSchema);
