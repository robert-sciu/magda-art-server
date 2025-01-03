const {
  handleErrorResponse,
  handleSuccessResponse,
} = require("../../utilities/controllerUtilities");
const logger = require("../../utilities/logger");
const authenticationService = require("./authenticationService");

async function login(req, res) {
  const { email, password } = req.body;
  try {
    const user = await authenticationService.getUserByEmail(email);
    if (!user) {
      return handleErrorResponse(res, 404, "user not found");
    }
    if (
      !(await authenticationService.verifyPassword(user.password, password))
    ) {
      return handleErrorResponse(res, 401, "wrong password");
    }

    const accessToken = authenticationService.getJWT(user);
    const refreshToken = authenticationService.getRefreshJWT(user);

    await authenticationService.saveRefreshToken(refreshToken, user.id);
    authenticationService.attachCookies(res, refreshToken);

    return handleSuccessResponse(res, 200, {
      token: accessToken,
    });
  } catch (error) {
    logger.error(error);
    return handleErrorResponse(
      res,
      500,
      "something went wrong, please try again"
    );
  }
}

module.exports = login;
