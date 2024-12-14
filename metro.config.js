const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Add binary and model file extensions
config.resolver.assetExts.push(
  "bin", // whisper model binary
  "mil" // CoreML model asset
);

module.exports = withNativeWind(config, { input: "./global.css" });
