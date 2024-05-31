module.exports = (sequelize, DataTypes) => {
  const PaintingFullRes = sequelize.define(
    "paintingFullRes",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      fileName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      createdAt: false,
      timestamps: false,
    }
  );

  PaintingFullRes.associate = (models) => {
    PaintingFullRes.belongsTo(models.painting, {
      foreignKey: "imageId",
      allowNull: false,
    });
  };

  return PaintingFullRes;
};
