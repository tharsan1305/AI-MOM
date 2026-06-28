const User = require('../models/User');
const Settings = require('../models/Settings');

const checkPromptLimit = async (userId) => {
  const user = await User.findById(userId).populate('subscription');
  const settings = await Settings.findOne() || { globalLimits: { defaultPromptLimitDaily: 3 } };
  
  if (!user) return { allowed: false, message: 'User not found' };
  
  // Superadmins and Admins have unlimited prompts
  if (user.role === 'admin' || user.role === 'superadmin') {
    return { allowed: true, limit: 'unlimited', remaining: 'unlimited' };
  }

  // Check if we need to reset today's prompt count
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (!user.promptsResetDate || user.promptsResetDate < today) {
    user.promptsToday = 0;
    user.promptsResetDate = today;
    await user.save({ validateBeforeSave: false });
  }

  // Determine limit based on plan or global default
  let dailyLimit = settings.globalLimits.defaultPromptLimitDaily;
  if (user.subscription && user.subscription.promptLimitDaily !== undefined) {
    dailyLimit = user.subscription.promptLimitDaily;
  }
  
  // -1 means unlimited
  if (dailyLimit === -1) {
    return { allowed: true, limit: 'unlimited', remaining: 'unlimited' };
  }

  if (user.promptsToday >= dailyLimit) {
    return { 
      allowed: false, 
      message: 'You have reached today\'s prompt limit.',
      limit: dailyLimit,
      remaining: 0
    };
  }

  return {
    allowed: true,
    limit: dailyLimit,
    remaining: dailyLimit - user.promptsToday
  };
};

const incrementPromptUsage = async (userId) => {
  await User.findByIdAndUpdate(userId, {
    $inc: { promptsToday: 1, totalPrompts: 1 }
  });
};

module.exports = { checkPromptLimit, incrementPromptUsage };
