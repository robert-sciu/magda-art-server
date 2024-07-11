module.exports = {
  development: {
    sqlite: {
      options: {
        dialect: "sqlite",
        storage: "./database.sqlite",
      },
    },
  },
  production: {
    sqlite: {
      options: {
        dialect: "sqlite",
        storage: "./database.sqlite",
      },
    },
  },
};

// development: {
//   postgres: {
//     options: {
//       port: 5432,
//       username: process.env.DB_USERNAME,
//       password: process.env.DB_PASSWORD,
//       dialect: "postgres",
//       database: process.env.DB_NAME,
//     },
//   },
// },
