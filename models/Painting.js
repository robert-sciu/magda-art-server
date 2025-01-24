module.exports = (sequelize, DataTypes) => {
  const Painting = sequelize.define(
    "Painting",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
      },
      description_en: {
        type: DataTypes.STRING(1000),
        allowNull: true,
      },
      description_de: {
        type: DataTypes.STRING(1000),
        allowNull: true,
      },
      description_es: {
        type: DataTypes.STRING(1000),
        allowNull: true,
      },
      description_pl: {
        type: DataTypes.STRING(1000),
        allowNull: true,
      },
      price_eur: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      is_available: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
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
      width_cm: {
        type: DataTypes.INTEGER,
      },
      height_cm: {
        type: DataTypes.INTEGER,
      },
      width_px: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      height_px: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      createdAt: false,
      timestamps: false,
    }
  );
  return Painting;
};
