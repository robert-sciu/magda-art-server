const {
  findRecordByValue,
  updateRecord,
} = require("../../utilities/dbUtilities");
const bcrypt = require("bcryptjs");
const {
  generateJWT,
  generateRefreshJWT,
  verifyJWT,
} = require("../../utilities/tokenUtilities");
const { User } = require("../../models").sequelize.models;
const config = require("../../config/config");

class AuthenticationService {
  constructor() {}
  async getUserByEmail(email) {
    return await findRecordByValue(User, { email: email });
  }

  async verifyPassword(hash, password) {
    return await bcrypt.compare(password, hash);
  }

  async getStoredToken(token) {
    return await findRecordByValue(User, { refreshToken: token });
  }

  getJWT(user) {
    return generateJWT(user);
  }

  getRefreshJWT(user) {
    return generateRefreshJWT(user);
  }

  decodeJWT(token) {
    return verifyJWT(token);
  }

  async saveRefreshToken(refreshToken, userId) {
    return await updateRecord(User, { refreshToken }, userId);
  }

  async revokeToken(userId) {
    return await updateRecord(User, { refreshToken: null }, userId);
  }

  attachCookies(res, refreshToken) {
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      domain:
        process.env.NODE_ENV === "production"
          ? process.env.SERVER_DOMAIN
          : process.env.DEV_ORIGIN,
      maxAge: config.common.tokensExpiration.refreshJWTExpirationTimeNumber,
    });
  }

  clearCookies(res) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
  }
}

const authenticationService = new AuthenticationService();

module.exports = authenticationService;
