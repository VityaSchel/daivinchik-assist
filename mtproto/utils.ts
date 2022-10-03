import { Buffer } from 'buffer'

export async function getUser(invalidateCache = false): Promise<object | null> {
  if(!invalidateCache && global.api.__fullUserData) return global.api.__fullUserData

  try {
    const user = await global.api.call('users.getFullUser', {
      id: {
        _: 'inputUserSelf',
      },
    })
    global.api.__fullUserData = user
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
  })
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

export async function getPassword(invalidateCache = false) {
  if(!invalidateCache && global.api.__account_password) return global.api.__account_password

  const result = await global.api.call('account.getPassword')
  if(result._ === 'account.password') {
    global.api.__account_password = result
    return result
  }
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

export async function getSelfPhoto(photoID: string): Promise<Buffer> {
  let i = 0
  const partSize = 524288

  const downloadPart = async (i: number): Promise<number[]> => {
    const part = await global.api.call('upload.getFile', {
      cdn_supported: false,
      location: {
        _: 'inputPeerPhotoFileLocation',
        big: false,
        peer: {
          _: 'inputPeerSelf',
        },
        photo_id: photoID
      },
      offset: i*partSize,
      limit: partSize
    })
    // const part = { bytes: [ ] }
    const bytes = part.bytes
    if(bytes.length > 0) return [...bytes, ...await downloadPart(i + 1)]
    else return bytes
  }

  const fileParts = await downloadPart(0)
  const file = Buffer.from(fileParts)

  return file
}