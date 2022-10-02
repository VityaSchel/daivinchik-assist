import MTProto from '@mtproto/core'
import { authorizeWithLoginCode, authorizeWith2FA } from './auth'
import { sendCode } from './utils'
import log from 'electron-log'

export const api = new MTProto({
  test: true,
  api_id: Number(process.env.API_ID),
  api_hash: process.env.API_HASH,

  storageOptions: { path: './tempdata.json' }
})
global.api = api