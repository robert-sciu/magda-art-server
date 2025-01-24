const imageCompressor = require("../../services/imageCompressor");
const { Painting } = require("../../models").sequelize.models;
const { sequelize } = require("../../models");
const {
  createRecord,
  findAllRecords,
  findRecordByValue,
  deleteRecord,
  updateRecord,
} = require("../../utilities/dbUtilities");
const s3Manager = require("../../services/s3Manager");
const { getImageDimmensions } = require("../../utilities/utilities");
const { destructureData } = require("../../utilities/controllerUtilities");
const paths = require("../../config/config").common.paths;
const imageResolutionTypes = require("../../config/config").common
  .imageResolutionTypes;

class PaintingsService {
  constructor() {}

  getPath(type) {
    return paths.paintings[type];
  }

  async getTransaction() {
    return await sequelize.transaction();
  }
  async getAllPaintings() {
    const paintings = await findAllRecords(Painting);
    return await this.attachImagePaths(paintings);
  }

  async getPaingingById(id) {
    return await findRecordByValue(Painting, { id });
  }

  async attachImagePaths(imagesArray) {
    const containingFolder = process.env.PAINTINGS_IMG_FOLDER_NAME;
    return await s3Manager.attachImageURLs({ imagesArray, containingFolder });
  }

  async generateCompressedPaintingImageObjects(req) {
    const paintingsFolder = process.env.PAINTINGS_IMG_FOLDER_NAME;
    const { title } = JSON.parse(req.body.JSON);
    const { originalname } = req.file;

    return await imageCompressor.generateCompressedImageObjects({
      imgFolder: paintingsFolder,
      file: req.file,
      filename: title.toLowerCase() || originalname,
      desktopSize: "large",
    });
  }

  async uploadPaintingImagesToS3(array) {
    return await s3Manager.bulkUploadImages(array);
  }

  destructurePaintingDataForDb(dataJson) {
    const data = JSON.parse(dataJson);
    const keys = [
      "title",
      "description_en",
      "description_de",
      "description_es",
      "description_pl",
      "width_cm",
      "height_cm",
      "price_eur",
      "is_available",
    ];
    return destructureData(data, keys);
  }

  async createPaintingDbEntry(data, transaction) {
    return await createRecord(Painting, data, transaction);
  }

  async updatePaintingDbEntry(updateData, id, transaction) {
    return await updateRecord(Painting, updateData, id, transaction);
  }

  getImageDimmensions(file) {
    return getImageDimmensions(file);
  }

  async deletePaintingImages(imageObject) {
    const filePathsArray = imageResolutionTypes.map(
      (size) => `${paths.paintings[size]}/${imageObject[`filename_${size}`]}`
    );
    return await s3Manager.bulkDeleteImages({ filePathsArray });
  }

  async deletePaintingDbEntry(id, transaction) {
    return await deleteRecord(Painting, id, transaction);
  }
}

const paintingsService = new PaintingsService();

module.exports = paintingsService;
