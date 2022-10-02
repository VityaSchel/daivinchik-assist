import setCookie from 'set-cookie-parser'
// According to AUTH.md

export async function sendCode(phone: string): Promise<{ error: 'too_many_tries' | string } | { error: null, random_hash: string }> {
  const body = new FormData()
  body.append('phone', phone)
  const responseRaw = await fetch('https://my.telegram.org/auth/send_password', {
    method: 'POST',
    body
  })
  const result = await responseRaw.text()
  if(result === 'Sorry, too many tries. Please try again later.') {
    return { error: 'too_many_tries' }
  } else {
    try {
      const response = JSON.parse(result)
      return { error: null, random_hash: response.random_hash }
    } catch(e) {
      console.error(e)
      return { error: JSON.stringify(e) }
    }
  }
}

export async function loginWithCode(phone: string, random_hash: string, code: string): Promise<{ error: 'incorrect_code' | 'cookie_not_found' | string } | { error: null, sessionToken: string }> {
  const body = new FormData()
  body.append('phone', phone)
  body.append('random_hash', random_hash)
  body.append('password', code)
  const responseRaw = await fetch('https://my.telegram.org/auth/login', {
    method: 'POST',
    body
  })
  const result = await responseRaw.text()
  if(result === 'Invalid confirmation code!') {
    return { error: 'incorrect_code' }
  } else if (result === 'true') {
    const rawCookiesHeaders = responseRaw.headers.get('Set-Cookie') as string
    const splitCookieHeaders = setCookie.splitCookiesString(rawCookiesHeaders)
    const cookies = setCookie.parse(splitCookieHeaders, { map: true })
    const sessionToken = cookies['stel_token']?.value
    if(!sessionToken) {
      return { error: 'cookie_not_found' }
    } else {
      return { error: null, sessionToken }
    }
  } else {
    return { error: result }
  }
}