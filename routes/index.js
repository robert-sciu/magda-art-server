// var express = require("express");
const authenticateJWT = require("../middleware/authenticationMiddleware");
const { authRouterOpen, authRouterAdmin } = require("./authentication");
const { contentRouterOpen, contentRouterAdmin } = require("./contents");
const { paintingsRouterAdmin } = require("./paintings");
const { userRouterOpen } = require("./users");

// var router = express.Router();

// /* GET home page. */
// router.get("/", function (req, res, next) {
//   res.render("index", { title: "Express" });
// });

// module.exports = router;

const apiBaseUrl = process.env.API_BASE_URL;

const openRoutes = (app) => {
  app.use(`${apiBaseUrl}/auth`, authRouterOpen());
  app.use(`${apiBaseUrl}/users`, userRouterOpen());
  // app.use(`${apiBaseUrl}/paintings`);
  app.use(`${apiBaseUrl}/contents`, contentRouterOpen());
  // app.use(`${apiBaseUrl}/pageImages`);
};

const adminRoutes = (app) => {
  app.use(authenticateJWT);
  app.use(`${apiBaseUrl}/admin/auth`, authRouterAdmin());
  app.use(`${apiBaseUrl}/admin/paintings`, paintingsRouterAdmin());
  app.use(`${apiBaseUrl}/admin/contents`, contentRouterAdmin());
  // app.use(`${apiBaseUrl}/admin/pageImages`);
};

module.exports = (app) => {
  openRoutes(app);
  adminRoutes(app);
};
