module.exports = {
  name: "pdfserverapp",
  slug: "pdfserverapp",
  version: "1.0.0",
  orientation: "portrait",
  scheme: "pdfserverapp",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/images/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.quantum17.pdfserverapp",
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    package: "com.quantum17.pdfserverapp",
  },
  web: {
    bundler: "metro",
    favicon: "./assets/images/favicon.png",
  },
  extra: {
    apiUrl: process.env.GOOGLE_IOS_CLIENT_ID,
    // ENTRY_FILE: "index.ts",
    eas: {
      projectId: "28d50f92-9b57-4839-a174-715217aeb8c8",
    },
  },
};
