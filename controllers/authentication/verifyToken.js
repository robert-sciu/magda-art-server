const {
  handleSuccessResponse,
} = require("../../utilities/controllerUtilities");

function verifyToken(req, res) {
  const user = req.user;
  return handleSuccessResponse(res, 200, { message: "Token verified", user });
}

module.exports = verifyToken;
