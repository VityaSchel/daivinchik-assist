import { usingElectron } from '../src/electron-wrapper'
import { authorizeWithLoginCode, authorizeWith2FA } from './auth'
import { sendCode } from './utils'

const log = {
  info: console.log
  //(...args: any) => {
  // if(usingElectron) {

  // } else {
  //   console.log(...args)
  // }
//}
}

type State = 'unauthorized'
  | 'pending_code'
  | 'pending_twofa'
  | 'authorized'
export let state: State = 'unauthorized'

export async function sendLoginCode(phone: string): Promise<{ phone_code_hash: string, error: null } | { error: 'phone_number_invalid' }> {
  try {
    log.info('Sending Telegram login code to', phone)
    const result = await sendCode(phone)
    const phone_code_hash = result?.['phone_code_hash']
    if(!phone_code_hash) return { error: result }
    state = 'pending_code'
    log.info('Sent code to', phone, 'and received hash', phone_code_hash)
    return { phone_code_hash, error: null }
  } catch(e) {
    console.error(e)
    if(e['error_message'] === 'PHONE_NUMBER_INVALID') return { error: 'phone_number_invalid' }
    else throw e
  }
}

export async function enterLoginCode(phone_code_hash: string, phone: string, code: string): Promise<{ success: boolean; error: 'account_not_found' | 'incorrect_code' | '2fa_password_needed' | 'expired_code' | string | null }> { 
  try {
    const result = await authorizeWithLoginCode(phone_code_hash, phone, code)
    if(result.error) {
      if(result.error === '2fa_password_needed') state = 'pending_twofa'
      return { success: false, error: result.error }
    }
    else start(result.user)
    return { success: true, error: null }
  } catch(e) {
    console.error(e)
    return { success: false, error: JSON.stringify(e) }
  }
}
export async function enterTwoFACode(code: string): Promise<{ success: boolean; error: 'incorrect_2fa' | null }> { 
  const result = await authorizeWith2FA(code)
  if(result.error) return { success: false, error: result.error }
  else start(result.user)
  return { success: true, error: null }
}

async function start(user: object) {
  state = 'authorized'
  console.log(`Пользователь ${user['user']['first_name']} авторизирован, бот начинает работу`)
}