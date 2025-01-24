module.exports = (sequelize, DataTypes) => {
  const PageImage = sequelize.define(
    "PageImage",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      imageName: {
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
      external_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      createdAt: false,
      timestamps: false,
      //this is indexing so that we can query by role a lot faster
      indexes: [
        {
          name: "idx_role",
          fields: ["role"],
        },
      ],
    }
  );
  return PageImage;
};
