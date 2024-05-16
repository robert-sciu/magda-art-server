module.exports = {
  development: {
    postgres: {
      options: {
        port: 5432,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        dialect: "postgres",
        database: process.env.DB_NAME,
      },
    },
  },
};
