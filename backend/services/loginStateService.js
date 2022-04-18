import User from "../models/userModel.js";

export const setLoginState = async (id) => {
  const user = await User.findById(id);
  if (user) {
    user.isOnline = true;
    user.lastConnection = null;
    await user.save();
  }
};

export const setLogoutState = async (id) => {
  const user = await User.findById(id);
  if (user) {
    user.isOnline = false;
    user.lastConnection = new Date();
    await user.save();
  }
};
