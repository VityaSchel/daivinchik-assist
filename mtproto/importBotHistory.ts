import { TextEncoder, TextDecoder } from 'text-encoding'
import AsyncStorage from '@react-native-async-storage/async-storage'
import _ from 'lodash'

type Peer = { id: string, access_hash: string }

export async function findLeomatchPeer(): Promise<{ error: 'unable_to_resolve_peer' | string } | { peer: Peer, error: null }> {
  if(process.env.NODE_ENV === 'development') return { peer: { access_hash: '5955963651186977509', id: '1234060895' }, error: null }
  
  try {
    const peer = await global.api.call('contacts.resolveUsername', {
      username: 'leomatchbot'
    })
    if(peer._ === 'contacts.resolvedPeer') {
      const bot = peer.users[0]
      if(!bot) {
        return { error: 'unable_to_resolve_peer' }
      } else {

        return { peer: { access_hash: bot.access_hash, id: bot.id }, error: null }
      }
    } else {
      return { error: 'unable_to_resolve_peer' }
    }
  } catch(e) {
    return { error: JSON.stringify(e) }
  }
}

const maxStorageSize = 4000000
const maxChunkSize = 1000000

export function exportHistory(leomatchPeer: Peer, callback: (exported: number, max: number, offset: number) => any, offset_?: number) {
  const pageSize = 100
  const messagesList: object[] = []
  let offset = Number.isInteger(offset_) ? offset_ : undefined
  let max: number
  let abortSignal = false

  return {
    promise: new Promise<void>(async (resolve) => {
      do {
        console.log('Calling export history with offset', offset, 'and limit', pageSize)
        const history = await global.api.call('messages.getHistory', {
          peer: {
            _: 'inputPeerUser',
            user_id: leomatchPeer.id,
            access_hash: leomatchPeer.access_hash,
          },
          offset_id: offset,
          limit: pageSize
        })
        if(abortSignal) break

        const messages = filterNecessaryData(history.messages)
        console.log('Saved', messages.length, 'messages')
    
        if(offset === undefined || offset_ !== undefined) max = history.count
    
        if(messages.length > 0) {
          offset = messages[messages.length - 1].id
        }
    
        callback(messagesList.length, max, offset ?? 0)
        
        if(messages.length > 0) {
          messagesList.push(...messages)
          const bytesLength = (new TextEncoder()).encode(JSON.stringify(messagesList)).length
          await saveMessagesLocally(messagesList)
          if(bytesLength/1024 > maxStorageSize) {
            break
          }
        } else {
          saveMessagesLocally(messagesList)
          break
        }
    
      } while(messagesList.length < max && messagesList.length < 100 && !abortSignal)
      resolve()
    }),
    abort: () => { abortSignal = true }
  }
}

const const_name = 'init_history_exported_msgs_tmp_'
async function saveMessagesLocally(messages: object[]) {
  const messagesSerialized = JSON.stringify(messages)
  // const messagesSerializedRaw = (new TextEncoder()).encode(JSON.stringify(messagesSerialized))
  // const messagesSerializedRawChunks = _.chunk(messagesSerializedRaw, maxChunkSize)
  // splitting characters in separate bytes => may be dangerous 
  // messagesSerializedRawChunks.map(chunk => )
  const maxChars = maxChunkSize / 2 // each char is 1-4 bytes, 2 is average
  const messagesSerializedChunksSplitted = _.chunk(messagesSerialized, maxChars)
  const messagesSerializedChunks = messagesSerializedChunksSplitted.map(splittedPart => splittedPart.join(''))
  const keyValuePairs: [string, string][] = messagesSerializedChunks.map((value, i) => [const_name + i, value])
  await AsyncStorage.multiSet(keyValuePairs)
  await AsyncStorage.removeItem(const_name + keyValuePairs.length)
}

function filterNecessaryData(messages: object[]) {
  return messages
    .filter(msg => msg._ === 'message')
    .map(msg => ({
      o: msg['out'] ? 1 : 0,
      t: msg['message'],
      d: msg['date'],
      ...(msg['media'] && { m: 1 })
    }))
}