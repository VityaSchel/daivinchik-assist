import { getUser, sendCode, signIn, getPassword, checkPassword } from './utils'

export async function authorizeWithLoginCode(phone_code_hash: string, phone: string, code: string): Promise<
  { user: object, error: null } 
  | { error: 'account_not_found'
    | 'incorrect_code'
    | '2fa_password_needed' 
  }
> {
  try {
    const signInResult = await signIn({
      code,
      phone,
      phone_code_hash,
    })

    if (signInResult._ === 'auth.authorizationSignUpRequired') return { error: 'account_not_found' }
    else return { user: await getUser() as object, error: null }
  } catch (error) {
    const _error = error as { [key: string]: any }
    switch (_error.error_message) {
      case 'SESSION_PASSWORD_NEEDED':
        return { error: '2fa_password_needed' }

      case 'PHONE_CODE_INVALID':
        console.log('Неправильный код! Попробуйте еще раз')
        return { error: 'incorrect_code' }

      default:
        throw error
    }
  }
}

export async function authorizeWith2FA(twoFApassword: string): Promise<
  { user: object, error: null } | { error: 'incorrect_2fa' }
> {
  try {
    await twoFA(twoFApassword)
  } catch(e) {
    const _e = e as { [key: string]: any }
    if(_e.error_message === 'PASSWORD_HASH_INVALID') return { error: 'incorrect_2fa' }
    else throw _e
  }
  return { user: await getUser() as object, error: null }
}

async function twoFA(password: string) {
  const { srp_id, current_algo, srp_B } = await getPassword()
  const { g, p, salt1, salt2 } = current_algo

  const { A, M1 } = await global.api.crypto.getSRPParams({
    g,
    p,
    salt1,
    salt2,
    gB: srp_B,
    password: password,
  })

  await checkPassword({ srp_id, A, M1 })
}