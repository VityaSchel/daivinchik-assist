/* eslint-disable @typescript-eslint/no-var-requires */
const { withExpoWebpack } = require('@expo/electron-adapter')

module.exports = config => {
  // config.module.rules.unshift({
  //   // Typescript loader
  //   test: /\.tsx?$/,
  //   exclude: /(node_modules|\.webpack)/,
  //   use: {
  //     loader: 'ts-loader',
  //     options: {
  //       transpileOnly: true,
  //       configFile: __dirname + '/tsconfig.json'
  //     },
  //   },
  // })
  return withExpoWebpack(config)
}
