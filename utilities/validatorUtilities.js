/**
 * Middleware to check for extra fields in the request body.
 *
 * @param {array} allowList - List of fields that are allowed in the request body.
 * @returns {function} A middleware function that will check the request body for
 *   extra fields not in the allowList. If any extra fields are found, a 400
 *   response with an appropriate error message is sent. Otherwise, the
 *   request is allowed to proceed.
 */
function checkForExtraFields(allowList) {
  return (req, res, next) => {
    const extraFields = Object.keys(req.body).filter(
      (key) => !allowList.includes(key)
    );
    if (extraFields.length > 0) {
      return res.status(400).json({
        error: `Unexpected fields: ${extraFields.join(", ")}`,
      });
    }
    next();
  };
}

module.exports = { checkForExtraFields };
