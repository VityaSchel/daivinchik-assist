/* eslint-disable @typescript-eslint/no-var-requires */
const { withExpoWebpack } = require('@expo/electron-adapter')
const fs = require('fs')

module.exports = config => {
  const config1 = withExpoWebpack(config)
  config1.module.rules.unshift({ test: /\.scss$/, use: ['style-loader','css-loader','sass-loader']})
  return config1
}
