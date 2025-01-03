module.exports = (sequelize, DataTypes) => {
  const PageImage = sequelize.define(
    "PageImage",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      placement: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      filename_desktop: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      filename_mobile: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      filename_lazy: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      externalUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      createdAt: false,
      timestamps: false,
    }
  );
  return PageImage;
};
