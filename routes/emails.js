const express = require("express");
const emailsController = require("../controllers/emailsController");

const mailerRouterOpen = () => {
  const router = express.Router();
  router.route("/").post(emailsController.sendEmail);
  return router;
};

module.exports = { mailerRouterOpen };
