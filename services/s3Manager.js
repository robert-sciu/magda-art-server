const awsS3Manager = require("./awsS3Manager");

const s3Manager =
  process.env.NODE_ENV === "production" ? awsS3Manager : awsS3Manager;

module.exports = s3Manager;
