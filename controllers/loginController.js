const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models").sequelize.models.user;

function generateAccessToken(payload) {
  return jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: "15m" });
}

async function verifyToken(req, res) {
  res.status(200).json({ isValid: true });
}

async function login(req, res) {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) {
      return res
        .status(400)
        .json({ status: "error", message: "User not found" });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ status: "error", message: "Wrong password" });
    }

    // when passing in user object to jwt.sign only include non sensitive information
    const payload = { user: user.name, email: user.email, id: user.id };
    // serializing user object
    const accessToken = generateAccessToken(payload);

    res.json({ token: accessToken });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
}

module.exports = { login, verifyToken };
