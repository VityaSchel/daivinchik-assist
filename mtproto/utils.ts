export async function getUser(): Promise<object | null> {
  try {
    const user = await global.api.call('users.getFullUser', {
      id: {
        _: 'inputUserSelf',
      },
    })

    return user
  } catch (error) {
    return null
  }
}

/**
 * @param phone Must start with `+` and have international format
 */
export function sendCode(phone: string) {
  return global.api.call('auth.sendCode', {
    phone_number: phone,
    settings: {
      _: 'codeSettings',
    },
  }, { dcId: 1 })
}

export function signIn({ code, phone, phone_code_hash }: { code: string, phone: string, phone_code_hash: any }) {
  return global.api.call('auth.signIn', {
    phone_code: code,
    phone_number: phone,
    phone_code_hash: phone_code_hash,
  })
}

export function signUp({ phone, phone_code_hash }: { phone: string, phone_code_hash: any }) {
  return global.api.call('auth.signUp', {
    phone_number: phone,
    phone_code_hash: phone_code_hash,
    first_name: 'MTProto',
    last_name: 'Core',
  })
}

export function getPassword() {
  return global.api.call('account.getPassword')
}

export function checkPassword({ srp_id, A, M1 }: { srp_id: any, A: any, M1: any }) {
  return global.api.call('auth.checkPassword', {
    password: {
      _: 'inputCheckPasswordSRP',
      srp_id,
      A,
      M1,
    },
  })
}