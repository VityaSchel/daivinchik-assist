import { Message } from '../src/ts/MessageSchema'

export async function onMessage(callback: (message: Message) => any) {
  // global.api.updates.on('updateShortChatMessage', (a) => callback('updateShortChatMessage', a))
  // global.api.updates.on('updateShortMessage', (a) => callback('updateShortMessage', a))
  // global.api.updates.on('updateShort', (a) => callback('updateShort', a))
  // global.api.updates.on('updateShortSentMessage', (a) => callback('updateShortSentMessage', a))
  // global.api.updates.on('updatesCombined', (a) => callback('updatesCombined', a))
  global.api.updates.on('updates', updatesInfo => {
    updatesInfo.updates
      .filter(update => update._ === 'updateNewMessage')
      .filter(update => update?.message?.peer_id?.user_id === '1234060895')
      .forEach(update => callback(update.message))
  })
  // global.api.updates.on('updates', console.log)
  // global.api.updates.on('updateNewMessage', (a) => callback('updateNewMessage', a))
}