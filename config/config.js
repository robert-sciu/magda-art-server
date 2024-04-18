module.exports = {
  development: {
    postgres: {
      options: {
        port: 5432,
        username: "postgres",
        password: "postgres",
        dialect: "postgres",
        database: "magda_art_db",
      },
    },
  },
};
