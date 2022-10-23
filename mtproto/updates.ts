import { Message } from '../src/ts/MessageSchema'

export function onMessage(callback: (message: Message) => any) {
  const updateCallback = updatesInfo => {
    updatesInfo.updates
      .filter(update => update._ === 'updateNewMessage')
      .filter(update => update?.message?.peer_id?.user_id === '1234060895')
      .forEach(update => callback(update.message))
  }
  global.api.updates.on('updates', updateCallback)
  return updateCallback
}