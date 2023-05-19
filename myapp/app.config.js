module.exports = {
  name: "Nextsync",
  slug: "nextsync",
  version: "1.0.0",
  orientation: "portrait",
  scheme: "nextsync",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/images/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.quantum17.nextsync",
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    package: "com.quantum17.nextsync",
  },
  web: {
    bundler: "metro",
    favicon: "./assets/images/favicon.png",
  },
  extra: {
    apiUrl: process.env.GOOGLE_IOS_CLIENT_ID,
    // ENTRY_FILE: "index.ts",
    eas: {
      projectId: "2fa83acc-9852-4f6d-9a32-7e57e42e9353",
    },
  },
};
