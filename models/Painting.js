module.exports = (sequelize, DataTypes) => {
  const Painting = sequelize.define(
    "painting",
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
      fileName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(1000),
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
      // path: {
      //   type: DataTypes.STRING,
      //   allowNull: false,
      //   unique: false,
      // },
    },
    {
      createdAt: false,
      timestamps: false,
    }
  );
  return Painting;
};
