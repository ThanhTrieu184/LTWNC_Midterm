const db = require("../models");
const User = db.user;
const bcrypt = require("bcrypt");

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username: username });
  const validPassword = await bcrypt.compare(password, user.password);
  if (validPassword) {
    res.cookie(
      "user",
      {
        user_id: user._id,
        username: username,
      },
      { signed: true }
    );
    return res.redirect(303, "/");
  }
  res.send("Login fail");
};

exports.logout = (req, res) => {
  res.clearCookie("user");
  res.redirect(303, "/login");
};
exports.getUserById = async (id) => {
  return User.findById(id);
};
