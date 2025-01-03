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
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  clearCookies(res) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  }
}

const authenticationService = new AuthenticationService();

module.exports = authenticationService;
