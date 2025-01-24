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
      medium: 860,
      small: 500,
      mobile: 400,
      mobileLarge: 900,
      lazy: 70,
    },
    userSelectableImageResolutions: ["large", "medium", "small"],

    imageResolutionTypes: ["desktop", "mobile", "lazy"],

    tokensExpiration: {
      JWTExpirationTime: "45m",
      refreshJWTExpirationTime: "7d",
      refreshJWTExpirationTimeNumber: 7 * 24 * 60 * 60 * 1000,
    },

    imageSections: [
      "logo",
      "socials",
      "hero",
      "welcome",
      "bioParallax",
      "bio",
      "galleryParallax",
      "visualizations",
    ],

    pageImagesQuantityLimits: {
      logo: 1,
      hero: 1,
      socials: 5,
      welcome: 4,
      bioParallax: 1,
      bio: 16,
      visualizations: 3,
      galleryParallax: 1,
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
