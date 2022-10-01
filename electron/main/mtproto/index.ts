import 'dotenv/config'
import MTProto from '@mtproto/core'
import authorize from './auth.js'
import { sendCode } from './utils.js'

export const api = new MTProto({
  api_id: Number(process.env.APP_ID),
  api_hash: process.env.APP_HASH,

  storageOptions: { path: './tempdata.json' }
})

export async function sendLoginCode(phone: string): Promise<any> {
  const { phone_code_hash } = await sendCode(phone)
  return phone_code_hash
}

export async function auth(phone_code_hash: string, phone: string, code: string) { 
  const user = await authorize(phone_code_hash, phone, code)
  console.log(`Пользователь ${user['user']['first_name']} авторизирован, бот начинает работу`)
}