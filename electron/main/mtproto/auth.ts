import { getUser, sendCode, signIn, getPassword, checkPassword } from './utils.js'
import { api } from './index'

type Error = 'account_not_found'
  | 'incorrect_code'
  | 'incorrect_2fa'
  | '2fa_password_needed'

export default async function authorizeWithLoginCode(phone_code_hash: string, phone: string, code: string, twoFApassword?: string): Promise<object | { error: Error }> {
  const user = await getUser()
  if (user) return user
  else {
    try {
      const signInResult = await signIn({
        code,
        phone,
        phone_code_hash,
      })

      if (signInResult._ === 'auth.authorizationSignUpRequired') return { error: 'account_not_found' }
      else return await getUser() as object
    } catch (error) {
      const _error = error as { [key: string]: any }
      switch (_error.error_message) {
        case 'SESSION_PASSWORD_NEEDED':
          if(!twoFApassword) return { error: '2fa_password_needed' }
          try {
            await twoFA(twoFApassword)
          } catch(e) {
            const _e = e as { [key: string]: any }
            if(_e.error_message === 'PASSWORD_HASH_INVALID') return { error: 'incorrect_2fa' }
            else throw error
          }
          return await getUser() as object

        case 'PHONE_CODE_INVALID':
          console.log('Неправильный код! Попробуйте еще раз')
          return { error: 'incorrect_code' }

        default:
          throw error
      }
    }
  }
}

export async function authorizeWith2FA() {
  
}

async function twoFA(password: string) {
  const { srp_id, current_algo, srp_B } = await getPassword()
  const { g, p, salt1, salt2 } = current_algo

  const { A, M1 } = await api.crypto.getSRPParams({
    g,
    p,
    salt1,
    salt2,
    gB: srp_B,
    password: password,
  })

  await checkPassword({ srp_id, A, M1 })
}