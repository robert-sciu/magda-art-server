const {
  handleErrorResponse,
  handleSuccessResponse,
} = require("../../utilities/controllerUtilities");
const logger = require("../../utilities/logger");
const authenticationService = require("./authenticationService");

async function logout(req, res) {
  const refreshToken = req.cookies.refreshToken;
  const user = req.user;

  if (!refreshToken) {
    return handleSuccessResponse(res, 200, "token already logged out");
  }
  try {
    const tokenData = await authenticationService.getStoredToken(refreshToken);
    if (tokenData) {
      await authenticationService.revokeToken(tokenData.id);
    }
    authenticationService.clearCookies(res);
    return handleSuccessResponse(res, 200, "logged out successfully");
  } catch (error) {
    logger.error(error);
    return handleErrorResponse(
      res,
      500,
      "something went wrong, please try again"
    );
  }
}

module.exports = logout;
