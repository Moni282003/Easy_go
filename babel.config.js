module.exports = function (api) {
  api.cache(true);
  return {
    presets: [['babel-preset-expo', { jsxImportSource: "nativewind" }]],

    plugins: [
      "react-native-reanimated/plugin",
      // Remove the following line as it is deprecated
      // 'expo-router/babel',
    ],
  };
};
