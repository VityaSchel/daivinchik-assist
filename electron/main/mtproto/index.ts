import MTProto from '@mtproto/core'
import { authorizeWithLoginCode, authorizeWith2FA } from './auth'
import { sendCode } from './utils'
import { log } from '../index'

export const api = new MTProto({
  test: true,
  api_id: Number(process.env.API_ID),
  api_hash: process.env.API_HASH,

  storageOptions: { path: './tempdata.json' }
})

type State = 'unauthorized'
  | 'pending_code'
  | 'pending_twofa'
  | 'authorized'
export let state: State = 'unauthorized'

export async function sendLoginCode(phone: string): Promise<{ phone_code_hash: string }> {
  log.info('Sending Telegram login code to', phone)
  const { phone_code_hash } = await sendCode(phone)
  state = 'pending_code'
  log.info('Sent code to', phone, 'and received hash', phone_code_hash)
  return { phone_code_hash }
}

export async function enterLoginCode(phone_code_hash: string, phone: string, code: string): Promise<{ success: boolean; error: 'account_not_found' | 'incorrect_code' | 'incorrect_2fa' | '2fa_password_needed' | null }> { 
  const result = await authorizeWithLoginCode(phone_code_hash, phone, code)
  if(result.error) {
    if(result.error === '2fa_password_needed') state = 'pending_twofa'
    return { success: false, error: result.error }
  }
  else start(result.user)
  return { success: true, error: null }
}
export async function enterTwoFACode(code: string) { 
  const result = await authorizeWith2FA(code)
  if(result.error) return { success: false, error: result.error }
  else start(result.user)
  return { success: true, error: null }
}

async function start(user: object) {
  state = 'authorized'
  console.log(`Пользователь ${user['user']['first_name']} авторизирован, бот начинает работу`)
}