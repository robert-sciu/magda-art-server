const {
  handleSuccessResponse,
} = require("../../utilities/controllerUtilities");
const contentService = require("./contentService");

async function getContent(req, res) {
  try {
    const content = await contentService.getContent();
    console.log(content);
    return handleSuccessResponse(res, 200, { data: content });
  } catch (error) {
    return handleSuccessResponse(res, 500, error.message);
  }
}

module.exports = getContent;
