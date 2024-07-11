const Minio = require("minio");

function minio() {
  return new Minio.Client({
    endPoint: process.env.BUCKET_ENDPOINT_MINIO,
    port: 9000,
    useSSL: false,
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
  });
}

const minioClient = process.env.DISK_STORAGE === "minio" ? minio() : null;

module.exports = minioClient;
