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
  icon: "./assets/images/icon.png",

  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.elisalimli.nextsync",
    googleServicesFile: "./GoogleService-Info.plist",
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    package: "com.elisalimli.nextsync",
    googleServicesFile: "./google-services.json",
  },
  web: {
    bundler: "metro",
    favicon: "./assets/images/favicon.png",
  },
  plugins: ["@react-native-google-signin/google-signin"],
  extra: {
    eas: {
      projectId: "ce790d53-b891-4b79-bcfb-0217b86caacf",
    },
    apiUrl: process.env.GOOGLE_IOS_CLIENT_ID,
    // ENTRY_FILE: "index.ts",
  },
};
