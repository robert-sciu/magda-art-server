const bcrypt = require("bcryptjs");
const {
  handleErrorResponse,
  handleSuccessResponse,
} = require("../utilities/controllerUtilities");
const logger = require("../utilities/logger");
const { User } = require("../models").sequelize.models;

async function createUser(req, res) {
  const userCreationIsActive = process.env.USER_CREATION_MODE === "active";
  if (!userCreationIsActive) {
    return handleErrorResponse(res, 403, "not allowed for now");
  }
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    await User.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      isAdmin: true,
    });
    return handleSuccessResponse(res, 200, "user created");
  } catch (error) {
    logger.error(error);
    return handleErrorResponse(res, 500, "something went wrong");
  }
}

module.exports = { createUser };
