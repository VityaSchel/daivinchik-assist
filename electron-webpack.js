/* eslint-disable @typescript-eslint/no-var-requires */
const { withExpoAdapter } = require('@expo/electron-adapter')

module.exports = withExpoAdapter({
  projectRoot: __dirname,
  title: 'test'
})
