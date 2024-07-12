function nonce(req, res, next) {
  const nonce = res.locals.nonce;
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", `'nonce-${nonce}'`, "'strict-dynamic'", "https:"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: [
        "'self'",
        "data:",
        "https://robert-sciu-magda-art-bucket.s3.eu-central-1.amazonaws.com",
      ],
      fontSrc: [
        "'self'",
        "https://robert-sciu-magda-art-bucket.s3.eu-central-1.amazonaws.com",
      ],
      connectSrc: ["'self'", "https://magda-art.click"],
      objectSrc: ["'none'"],
      frameAncestors: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
    },
  })(req, res, next);

  next();
}

module.exports = { nonce };
