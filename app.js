var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

const router = require("./routes");

const {
  useHelmet,
  useCommonMiddleware,
  useCors,
  useSecureConnection,
  useRateLimit,
} = require("./middleware/commonMiddleware");

var app = express();

useHelmet(app);

useCommonMiddleware(app);

useCors(app);

useSecureConnection(app);

useRateLimit(app);
// app.use((req, res, next) => {
//   const nonce = crypto.randomBytes(16).toString("hex");
//   res.locals.nonce = nonce;
//   next();
// });

app.use(express.static(path.join(__dirname, "public")));

router(app);

app.use((req, res, next) => {
  res.status(404).send("404: Page Not Found");
});

app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
