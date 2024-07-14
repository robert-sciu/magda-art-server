const jwt = require("jsonwebtoken");

function authenticateJWT(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    res.status(403).json({ status: "error", message: "No token provided" });
    return;
  }
  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) {
      res.status(403).json({ status: "error", message: "Invalid token" });
      return;
    }
    req.user = user;
    next();
  });

  // next();
}

module.exports = { authenticateJWT };
