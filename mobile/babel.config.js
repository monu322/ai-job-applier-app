module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      // Removed reanimated plugin for web compatibility
      // "react-native-reanimated/plugin",
    ],
  };
};
