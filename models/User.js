module.exports = (sequelize, Datatypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: Datatypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      username: {
        type: Datatypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: Datatypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Datatypes.STRING,
        allowNull: false,
      },
      refreshToken: {
        type: Datatypes.STRING,
        allowNull: true,
      },
      isAdmin: {
        type: Datatypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      timestamps: false,
      createdAt: false,
    }
  );

  return User;
};
