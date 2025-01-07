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

  common: {
    imageResolutions: {
      large: 1920,
      medium: 960,
      small: 600,
      mobile: 500,
      lazy: 100,
    },
    userSelectableImageResolutions: ["large", "medium", "small"],

    imageResolutionTypes: ["desktop", "mobile", "lazy"],

    tokensExpiration: {
      JWTExpirationTime: "45m",
      refreshJWTExpirationTime: "7d",
      refreshJWTExpirationTimeNumber: 7 * 24 * 60 * 60 * 1000,
    },

    paths: {
      pageImages: {
        desktop: `${process.env.PAGE_IMG_FOLDER_NAME}/${process.env.DESKTOP_IMG_FOLDER_NAME}`,
        mobile: `${process.env.PAGE_IMG_FOLDER_NAME}/${process.env.MOBILE_IMG_FOLDER_NAME}`,
        lazy: `${process.env.PAGE_IMG_FOLDER_NAME}/${process.env.LAZY_IMG_FOLDER_NAME}`,
      },
      paintings: {
        desktop: `${process.env.PAINTINGS_IMG_FOLDER_NAME}/${process.env.DESKTOP_IMG_FOLDER_NAME}`,
        mobile: `${process.env.PAINTINGS_IMG_FOLDER_NAME}/${process.env.MOBILE_IMG_FOLDER_NAME}`,
        lazy: `${process.env.PAINTINGS_IMG_FOLDER_NAME}/${process.env.LAZY_IMG_FOLDER_NAME}`,
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
