// var express = require("express");
const authenticateJWT = require("../middleware/authenticationMiddleware");
const sanitize = require("../middleware/sanitization");
const { authRouterOpen, authRouterAdmin } = require("./authentication");
const { contentRouterOpen, contentRouterAdmin } = require("./contents");
const { mailerRouterOpen } = require("./emails");
const { pageImageRouterAdmin, pageImageRouterOpen } = require("./pageImages");
const { paintingsRouterAdmin, paintingsRouterOpen } = require("./paintings");
const { userRouterOpen } = require("./users");

const apiBaseUrl = process.env.API_BASE_URL;

const openRoutes = (app) => {
  app.use(sanitize);
  app.use(`${apiBaseUrl}/auth`, authRouterOpen());
  app.use(`${apiBaseUrl}/users`, userRouterOpen());
  app.use(`${apiBaseUrl}/paintings`, paintingsRouterOpen());
  app.use(`${apiBaseUrl}/contents`, contentRouterOpen());
  app.use(`${apiBaseUrl}/pageImages`, pageImageRouterOpen());
  app.use(`${apiBaseUrl}/mailer`, mailerRouterOpen());
};

const adminRoutes = (app) => {
  app.use(sanitize);
  app.use(authenticateJWT);
  app.use(`${apiBaseUrl}/admin/auth`, authRouterAdmin());
  app.use(`${apiBaseUrl}/admin/paintings`, paintingsRouterAdmin());
  app.use(`${apiBaseUrl}/admin/contents`, contentRouterAdmin());
  app.use(`${apiBaseUrl}/admin/pageImages`, pageImageRouterAdmin());
};

module.exports = (app) => {
  openRoutes(app);
  adminRoutes(app);
};
