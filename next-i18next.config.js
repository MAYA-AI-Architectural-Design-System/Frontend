module.exports = {
  i18n: {
    defaultLocale: "en",
    locales: ["en", "am", "fr", "es"],
    localeDetection: true,
  },
  reloadOnPrerender: process.env.NODE_ENV === "development",
};
