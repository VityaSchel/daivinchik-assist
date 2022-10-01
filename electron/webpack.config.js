/* eslint-disable @typescript-eslint/no-var-requires */
const { withExpoWebpack } = require('@expo/electron-adapter')

module.exports = config => {
  // config.module.rules.unshift({
  //   // Typescript loader
  //   test: /\.ts$/,
  //   exclude: /(node_modules|\.webpack)/,
  //   use: {
  //     loader: 'ts-loader',
  //     options: {
  //       transpileOnly: true,
  //       // configFile: __dirname + '/tsconfig.json'
  //     },
  //   },
  // })
  // config.module.rules.find(m => m.use.loader === 'babel-loader').use.options.presets[0][0] = '@babel/preset-typescript'
  return withExpoWebpack(config)
}
