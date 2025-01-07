const jwt = require("jsonwebtoken");
const config = require("../config/config");

function generateJWT(user) {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: config.common.tokensExpiration.JWTExpirationTime,
    }
  );
}

function generateRefreshJWT(user) {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: config.common.tokensExpiration.refreshJWTExpirationTime,
    }
  );
}

function verifyJWT(token) {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
}

module.exports = {
  generateJWT,
  generateRefreshJWT,
  verifyJWT,
};
