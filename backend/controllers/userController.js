// backend/controllers/userController.js

const User = require('../models/User');
const TokenLog = require('../models/TokenLog');

// Fetch user details, including token consumption
exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get the total tokens consumed by the user from TokenLog
    const tokenLogs = await TokenLog.aggregate([
      { $match: { user: user._id } },
      { $group: { _id: null, totalTokens: { $sum: "$tokensDeducted" } } }
    ]);

    const totalTokensConsumed = tokenLogs.length ? tokenLogs[0].totalTokens : 0;

    res.json({
      username: user.username,
      tokenBalance: user.tokenBalance,
      totalTokensConsumed
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
