const content = require("../models").sequelize.models.content;

async function getAllContent(req, res) {
  try {
    const contentData = await content.findAll();
    res.json({ status: "success", data: contentData });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
}

async function updateContent(req, res) {
  const json = req.body;
  try {
    const [contentData, created] = await content.upsert(json, {
      returning: true,
    });
    res.json({
      status: "success",
      message: created
        ? "data created successfully"
        : "data updated successfully",
      data: contentData,
    });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
}

module.exports = {
  getAllContent,
  updateContent,
};
