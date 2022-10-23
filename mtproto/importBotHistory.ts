import { TextEncoder, TextDecoder } from 'text-encoding'
import AsyncStorage from '@react-native-async-storage/async-storage'
import _ from 'lodash'
import { Message, MessageFields } from '../src/models/Message'
import type { Peer } from './utils'

const devTest = {
  enabled: true,
  pageSize: 10,
  pages: 2
}

export function exportHistory(leomatchPeer: Peer, callback: (exported: number, max: number, offset: number) => any, offset_?: number, finishedCallback: () => any) {
  let abortSignal = false
  let max: number

  return {
    promise: new Promise<void>(async (resolve) => {
      const pageSize = devTest.enabled ? devTest.pageSize : 100
      let offsetID = Number.isInteger(offset_) ? offset_ : undefined
      const realm: Realm = global.realm
      console.log('Message count', realm.objects('Message').length)
      let exportedMessagesCount = offset_ ? realm.objects('Message').length : 0

      do {
        console.log('Calling export history with offset', offsetID, 'and limit', pageSize, 'Exported:', exportedMessagesCount)
        
        const history = await global.api.call('messages.getHistory', {
          peer: {
            _: 'inputPeerUser',
            user_id: leomatchPeer.id,
            access_hash: leomatchPeer.access_hash,
          },
          offset_id: offsetID,
          limit: pageSize
        })
        if(abortSignal) break

        const messages = history.messages

        if(offsetID === undefined || offset_ !== undefined) max = history.count
          
        offsetID = history.messages[history.messages.length - 1].id
        exportedMessagesCount += messages.length
        console.log('Saved', exportedMessagesCount, 'messages')
        callback(exportedMessagesCount, max, offsetID ?? 0)
        realm.write(() => {
          for(const message of messages) {
            realm.create('Message', Message.generate(message))
          }
        })

        if(messages.length === 0) {
          break
        }

        if(devTest && exportedMessagesCount >= devTest.pageSize * devTest.pages) {
          break
        }
    
      } while(exportedMessagesCount < max && !abortSignal)
      if(exportedMessagesCount >= max) finishedCallback()
      resolve()
    }),
    abort: () => { abortSignal = true }
  }
}

// const const_name = 'init_history_exported_msgs_tmp_'
// async function saveMessagesLocally(messages: object[]) {
//   const messagesSerialized = JSON.stringify(messages)
//   const maxChars = maxChunkSize / 2 // each char is 1-4 bytes, 2 is average
//   const messagesSerializedChunksSplitted = _.chunk(messagesSerialized, maxChars)
//   const messagesSerializedChunks = messagesSerializedChunksSplitted.map(splittedPart => splittedPart.join(''))
//   const keyValuePairs: [string, string][] = messagesSerializedChunks.map((value, i) => [const_name + i, value])
//   console.log('Saved', keyValuePairs.length, 'pairs to storage')

//   const keys = await getStorageKeys()
//   keys.length && await AsyncStorage.multiRemove(keys)
//   await AsyncStorage.multiSet(keyValuePairs)
// }

// async function readAndParseMessagesLocally() {
//   const keys = await getStorageKeys()
//   if(!keys.length) return []
//   const keyValuePairs = await AsyncStorage.multiGet(keys)
//   const messagesSerializedChunks = keyValuePairs.map(([, value]) => value)
//   const messagesSerialized = messagesSerializedChunks.join('')
//   const messages = JSON.parse(messagesSerialized)
//   console.log('Successfully retrived', messages.length, 'from storage and resumed downloading')
//   return messages
// }

// async function getStorageKeys() {
//   const allKeys = await AsyncStorage.getAllKeys()
//   const tmpKeys = allKeys.filter(key => key.startsWith(const_name))
//   return tmpKeys
// }


export function postProcessMessages(finishedCallback: () => any, errorCallback: (reason: string) => any) {
  const realm: Realm = global.realm

  const entries = realm.objects('Message').entries()
  
  for(const iterator of entries) {
    try {
      const dbEntry = iterator[1] as unknown as MessageFields
      const currentMessage: MessageFields = dbEntry

      const getNMessage = (offset: number): MessageFields | undefined => {
        const message = realm.objects('Message')
          .filtered(`messageID ${offset > 0 ? '>' : '<'} ${currentMessage.messageID}`)
          .sorted([['messageID', offset < 0]])
          .slice(0, 1)[0] as unknown as MessageFields | undefined

        return message
      }

      if(currentMessage.type === 'candidate_profile') {
        const previousMessage = getNMessage(-1)
        if(previousMessage && previousMessage.text === 'Так выглядит твоя анкета:') {
          realm.write(() => { currentMessage.type = 'self_profile' })
        } else {
          const nextMessage = getNMessage(+1)
          switch(nextMessage?.text) {
            case '❤️':
              realm.write(() => { currentMessage.info['response'] = 'like' })
              break
            case '👎':
              realm.write(() => { currentMessage.info['response'] = 'dislike' })
              break
            default:
              break
          }
        }
      }
    } catch(e) {
      console.error(e)
      errorCallback(e?.message ?? JSON.stringify(e))
    }
  }
  
  finishedCallback()
}