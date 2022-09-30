/* eslint-disable @typescript-eslint/no-var-requires */
module.exports = {
  appId: 'com.vityaschel.daivinchik-assist',
  productName: 'Дайвинчик Ассист',
  compression: 'store',
  mac: {
    identity: null
  },
  extraMetadata: {
    main: 'main.ts'
  },
  files: [
    {
      from: 'dist/main/',
      to: './',
      filter: ['**/*']
    },
    {
      from: 'dist/renderer',
      to: './',
      filter: ['**/*']
    },
    'package.json',
    '**/node_modules/**/*'
  ]
}