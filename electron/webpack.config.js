/* eslint-disable @typescript-eslint/no-var-requires */
const { withExpoWebpack } = require('@expo/electron-adapter')

module.exports = config => {
  const config1 = withExpoWebpack(config)
  config1.module.rules.push({ 
    test: /\.tsx?$/, 
    use: [
      { 
        loader: 'string-replace-loader',
        options: {
          search: /style={styles\.([a-zA-Z_0-9]+)}/,
          replace: 'style={{ "--realClassName": "$1" }}',
        }
      }
    ]
  })
  return config1
}
