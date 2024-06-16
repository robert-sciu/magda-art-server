const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models").sequelize.models.user;

function generateAccessToken(payload) {
  return jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: "15m" });
}

function generateRefreshToken(payload) {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
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

    const refreshToken = generateRefreshToken(payload);

    // saving refresh token in database
    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({ token: accessToken });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
}

async function refreshToken(req, res) {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken)
    return res.status(401).json({ status: "error", message: "no token" });

  try {
    const user = await User.findOne({ where: { refreshToken } });

    if (!user)
      return res.status(403).json({ status: "error", message: "forbidden" });

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err)
        return res.status(403).json({ status: "error", message: "forbidden" });
      const payload = { user: user.name, email: user.email, id: user.id };
      const accessToken = generateAccessToken(payload);
      res.json({ token: accessToken });
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
}

async function logout(req, res) {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken)
    return res.status(401).json({ status: "error", message: "no token" });
  try {
    const user = await User.findOne({ where: { refreshToken: refreshToken } });
    if (!user)
      return res.status(403).json({ status: "error", message: "Forbidden" });
    user.refreshToken = null;

    await user.save();

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    res;

    res.status(204).json({ status: "success", message: "logged out" });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
}

module.exports = { login, refreshToken, logout };
