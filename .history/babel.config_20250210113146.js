module.exports = {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
      // 其他插件
      ['module:react-native-dotenv'] // 如果你同时使用了 react-native-dotenv
    ]
  };