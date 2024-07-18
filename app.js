var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const crypto = require("crypto");
const fs = require("fs");

// var indexRouter = require("./routes/index");
const paintingsRouter = require("./routes/paintings");
const contentsRouter = require("./routes/contents");
const pageImagesRouter = require("./routes/pageImages");
const emailsRouter = require("./routes/emails");
const loginRouter = require("./routes/login");
const userRouter = require("./routes/users");
const { secureConnectionChecker } = require("./utilities/utilities");

var app = express();

app.use((req, res, next) => {
  const nonce = crypto.randomBytes(16).toString("hex");
  res.locals.nonce = nonce;
  next(); // pass control to the next handler)
});

// app.use(helmet());

// app.use(
//   helmet({
//     contentSecurityPolicy: {
//       directives: {
//         defaultSrc: ["'self'"],
//         scriptSrc: ["'report-sample'", "'self'"],
//         styleSrc: ["'report-sample'", "'self'"],
//         objectSrc: ["'none'"],
//         baseUri: ["'self'"],
//         connectSrc: ["https://www.magda-art.click"],
//         fontSrc: ["'self'"],
//         frameSrc: ["'self'"],
//         imgSrc: [
//           "'self'",
//           "https://robert-sciu-magda-art-bucket.s3.eu-central-1.amazonaws.com",
//         ],
//         manifestSrc: ["'self'"],
//         mediaSrc: ["'self'"],
//         workerSrc: ["'none'"],

//         // Add other directives as needed
//       },
//     },
//   })
// );

// view engine setup
// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const allowedOrigins = [process.env.ORIGIN];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    optionsSuccessStatus: 200,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

secureConnectionChecker(app);

// app.get("/api/v1/nonce", (req, res) => {
//   const nonce = res.locals.nonce;
//   res.json({ nonce });
// });

app.use("/api/v1/paintings", paintingsRouter);
app.use("/api/v1/contents", contentsRouter);
app.use("/api/v1/pageImages", pageImagesRouter);
app.use("/api/v1/mail", emailsRouter);
app.use("/api/v1/login", loginRouter);
app.use("/api/v1/users", userRouter);

// catch 404 and forward to error handler
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
