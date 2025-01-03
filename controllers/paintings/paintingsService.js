const imageCompressor = require("../../utilities/imageCompressor");
const { Painting } = require("../../models").sequelize.models;
const { createRecord } = require("../../utilities/dbUtilities");
const s3Manager = require("../../utilities/s3Manager");

class PaintingsService {
  constructor() {}

  async generateCompressedPaintingImageObjects(req) {
    const paintingsPath = process.env.PAINTINGS_IMG_PATH;
    const { title } = JSON.parse(req.body.JSON);
    const { originalname } = req.file;

    return await imageCompressor.generateCompressedImageObjects({
      imgPath: paintingsPath,
      file: req.file,
      filename: title || originalname,
      desktopSize: "large",
    });
  }

  async uploadPaintingImagesToS3(array) {
    return await s3Manager.bulkUploadFiles(array);
  }

  async createPaintingDbEntry(data) {
    return await createRecord(Painting, data);
  }
}

const paintingsService = new PaintingsService();

module.exports = paintingsService;
