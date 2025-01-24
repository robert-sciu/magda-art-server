const express = require("express");
const contentsController = require("../controllers/content");

const contentRouterOpen = () => {
  const router = express.Router();
  router.route("/").get(contentsController.getContent);
  return router;
};

const contentRouterAdmin = () => {
  const router = express.Router();
  router.route("/").post(contentsController.postContent);
  return router;
};

module.exports = {
  contentRouterOpen,
  contentRouterAdmin,
};
