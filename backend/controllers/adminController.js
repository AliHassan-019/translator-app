// backend/controllers/adminController.js

const User = require('../models/User');
const TokenLog = require('../models/TokenLog');

const getAllUsers = async (req, res) => {
  try {
    // Fetch all users
    const users = await User.find();

    // Aggregate token logs by user to compute total tokens consumed
    const tokenLogs = await TokenLog.aggregate([
      { $group: { _id: '$user', totalTokens: { $sum: '$tokensDeducted' } } }
    ]);

    // Build a lookup map from user ID to total tokens consumed
    const tokenMap = {};
    tokenLogs.forEach(log => {
      tokenMap[log._id.toString()] = log.totalTokens;
    });

    // Add totalTokensConsumed property to each user document
    const usersWithConsumption = users.map(u => {
      const userObj = u.toObject();
      userObj.totalTokensConsumed = tokenMap[u._id.toString()] || 0;
      return userObj;
    });

    res.json(usersWithConsumption);
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateUserTokens = async (req, res) => {
  try {
    // Update tokenBalance using the $inc operator
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $inc: { tokenBalance: req.body.amount } },
      { new: true }
    );

    // Recalculate total tokens consumed for that user
    const tokenLogs = await TokenLog.aggregate([
      { $match: { user: user._id } },
      { $group: { _id: '$user', totalTokens: { $sum: '$tokensDeducted' } } }
    ]);
    let totalTokensConsumed = 0;
    if (tokenLogs.length > 0) {
      totalTokensConsumed = tokenLogs[0].totalTokens;
    }

    // Convert user document to plain object and add totalTokensConsumed
    const userObj = user.toObject();
    userObj.totalTokensConsumed = totalTokensConsumed;

    res.json(userObj);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = { getAllUsers, updateUserTokens };
