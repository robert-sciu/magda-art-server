const Minio = require("minio");

const minioClient = new Minio.Client({
  endPoint: process.env.BUCKET_ENDPOINT_MINIO,
  port: 9000,
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

module.exports = minioClient;
