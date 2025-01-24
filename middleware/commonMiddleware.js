const helmet = require("helmet");
const logger = require("morgan");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const { production } = require("../config/config");

function useHelmet(app) {
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'report-sample'", "'self'"],
          styleSrc: ["'report-sample'", "'self'"],
          objectSrc: ["'none'"],
          baseUri: ["'self'"],
          connectSrc: ["https://www.magda-art.click"],
          fontSrc: ["'self'"],
          frameSrc: ["'self'"],
          imgSrc: [
            "'self'",
            "data:",
            "https://robert-sciu-magda-art-bucket.s3.eu-central-1.amazonaws.com",
          ],
          manifestSrc: ["'self'"],
          mediaSrc: ["'self'"],
          workerSrc: ["'none'"],
        },
      },
    })
  );
}

function useCommonMiddleware(app) {
  app.set("view engine", "ejs");
  app.use(logger("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
}

// const allowedOrigins =
//   process.env.NODE_ENV === "production"
//     ? [null]
//     : [process.env.DEV_ORIGIN, process.env.PREVIEW_ORIGIN];

// const allowedOrigins = [process.env.DEV_ORIGIN];

function useCors(app) {
  const allowedOrigins =
    process.env.NODE_ENV === "production"
      ? [process.env.PRODUCTION_ORIGIN || "https://your-production-domain.com"]
      : [
          process.env.DEV_ORIGIN || "http://localhost:5173",
          process.env.PREVIEW_ORIGIN || "http://localhost:4173",
        ];
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
      credentials: true,
      methods: "GET, POST, PUT, PATCH, DELETE, OPTIONS",
      allowedHeaders: [
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "X-auth-token",
        "Origin",
      ],
    })
  );
}

function useSecureConnection(app) {
  if (process.env.NODE_ENV === "production") {
    app.use((req, res, next) => {
      if (req.secure || req.get("X-Forwarded-Proto") === "https") {
        return next();
      } else {
        res.redirect("https://" + req.hostname + req.url);
      }
    });
  } else {
    app.use((req, res, next) => {
      next();
    });
  }
}

function useRateLimit(app) {
  const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 300,
  });

  app.use(limiter);
}

module.exports = {
  useHelmet,
  useCommonMiddleware,
  useCors,
  useSecureConnection,
  useRateLimit,
};
