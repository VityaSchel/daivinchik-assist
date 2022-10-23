export const pepper = 'Дайвинчик Ассист'

/**
 * This list contains Telegram userIDs of people who may block+report you
 * if you send message to them for no reason. The list is maintained and
 * an entry is added only if it has been proved that user deserves to be put
 * in there. Most likely you won't ever meet someone from here — especially if
 * you're reding this text in your native language.
 * 
 * You may ask any maintainer of this repository to add user here, but please 
 * do it privately, do not open issues and pull requests for this purpose. 
 * 
 * To protect privacy of the app's users, I've decided to put userIDs here instead
 * of sending it to third-party or server.
 * 
 * To protect privacy of users listed below (which they don't deserve, but I don't
 * want to tempt bad people into cyberbullying), all userIDs here are hashed using
 * sha256 with shared secret pepper as follows: "${userID}_${pepper}_${userID}"
 * 
 * If you have any suggestions on how to improve protection against rainbow tables,
 * please open an issue :)
 */
export const dangerousUsersList = [
  '3355b45e6580705b0ee50822fa814ee77f470ecc10c573439ceb1c035b52b6cf'
]