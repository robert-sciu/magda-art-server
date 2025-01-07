/**
 * Sends a JSON response with a success status.
 *
 * @param {Object} res - The response object.
 * @param {number} statusCode - The HTTP status code to be sent.
 * @param {string|Object} response - The response message or data to be sent.
 * If a string is provided, it is sent as a message. If an object is provided,
 * it is sent as data.
 */
function handleSuccessResponse(res, statusCode, response) {
  if (typeof response === "string") {
    return res.status(statusCode).json({ success: true, message: response });
  }
  return res.status(statusCode).json({ success: true, data: response });
}

/**
 * Sends a JSON response with an error status.
 *
 * @param {Object} res - The response object.
 * @param {number} statusCode - The HTTP status code to be sent.
 * @param {string} message - The error message to be sent.
 */
function handleErrorResponse(res, statusCode, message) {
  return res.status(statusCode).json({ success: false, message: message });
}

/**
 * Attaches an id parameter to the request object, if it exists.
 *
 * Checks if there is an id parameter in the request's parameters.
 * If it does not exist, sends a 400 error response.
 * If it does exist, assigns the id as a property of the request object.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {function} next - The next middleware function in the stack.
 */
function attachIdParam(req, res, next) {
  const { id } = req.params;
  if (!id) {
    return handleErrorResponse(res, 400, "No id");
  }
  req.id = id;
  next();
}

module.exports = {
  handleSuccessResponse,
  handleErrorResponse,
  attachIdParam,
};
