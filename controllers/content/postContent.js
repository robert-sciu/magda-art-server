const {
  handleSuccessResponse,
  handleErrorResponse,
} = require("../../utilities/controllerUtilities");
const contentService = require("./contentService");

async function postContent(req, res) {
  const json = req.body;
  try {
    await contentService.updateContent(json);
    return handleSuccessResponse(res, 200, "content updated");
  } catch (error) {
    return handleErrorResponse(res, 500, error.message);
  }
}

module.exports = postContent;
