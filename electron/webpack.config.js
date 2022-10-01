/* eslint-disable @typescript-eslint/no-var-requires */
const { withExpoWebpack } = require('@expo/electron-adapter')

module.exports = config => {
  return withExpoWebpack(config)
}
