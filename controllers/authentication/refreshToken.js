const logger = require("../../utilities/logger");

const authenticationService = require("./authenticationService");
const {
  handleErrorResponse,
  handleSuccessResponse,
} = require("../../utilities/controllerUtilities");

async function refreshToken(req, res) {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return handleErrorResponse(res, 401, "no token");
  }
  try {
    const decoded = authenticationService.decodeJWT(refreshToken);
    const storedToken = await authenticationService.getStoredToken(
      refreshToken
    );
    if (!storedToken) {
      return handleErrorResponse(res, 401, "invalid token");
    }
    if (storedToken.expires < Date.now()) {
      return handleErrorResponse(res, 401, "token expired");
    }
    const accessToken = authenticationService.getJWT(decoded);
    return handleSuccessResponse(res, 200, { token: accessToken });
  } catch (error) {
    logger.error(error);
    return handleErrorResponse(
      res,
      500,
      "something went wrong, please try again"
    );
  }
}

module.exports = refreshToken;
