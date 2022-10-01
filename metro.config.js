/* eslint-disable @typescript-eslint/no-var-requires */
const { getDefaultConfig } = require('expo/metro-config')
const exclusionList = require('metro-config/src/defaults/exclusionList')

const config = getDefaultConfig(__dirname)

config.resolver.blacklistRE = exclusionList([/node_modules\/electron\/.*/])
config.transformer.babelTransformerPath = require.resolve('react-native-sass-transformer')
config.resolver.sourceExts.push('scss', 'sass')

module.exports = config