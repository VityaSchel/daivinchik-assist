/* eslint-disable @typescript-eslint/no-var-requires */
const { getDefaultConfig } = require('expo/metro-config')
const exclusionList = require('metro-config/src/defaults/exclusionList')

const config = getDefaultConfig(__dirname)

config.resolver.blacklistRE = exclusionList([/node_modules\/electron\/.*/, /src\/electron-wrapper\.ts$/])

module.exports = config
{
  ...,
  resolver: {
    blacklistRE: exclusionList([/node_modules\/electron\/.*/, /src\/electron-wrapper\.ts$/])
  },
  transform
}
