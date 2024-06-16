const jwt = require("jsonwebtoken");

function authenticateJWT(req, res, next) {
  const token = req.headers.authorization;
  console.log("token ", token);
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
}

module.exports = { authenticateJWT };
