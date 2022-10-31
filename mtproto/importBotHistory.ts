import { Message, MessageFields } from '../src/models/Message'
import type { Peer } from './utils'

const devTest = {
  enabled: true,
  pageSize: 10,
  pages: 2
}

export function exportHistory(leomatchPeer: Peer, callback?: (exported: number, max: number, offset: number) => any, offset?: { type: 'downloadOlder' | 'downloadNewer', value: number }, finishedCallback?: () => any) {
  let abortSignal = false
  let max: number

  return {
    promise: new Promise<void>(async (resolve) => {
      const pageSize = devTest.enabled ? devTest.pageSize : 100
      const realm: Realm = global.realm
      console.log('Message count', realm.objects('Message').length)
      let exportedMessagesCount = offset ? realm.objects('Message').length : 0
      let offsetValue = (offset && Number.isInteger(offset?.value)) ? offset.value : undefined

      do {
        console.log('Calling export history with offset', offset && offsetValue, 'and limit', pageSize, 'Exported:', exportedMessagesCount)
        
        const history = await global.api.call('messages.getHistory', {
          peer: {
            _: 'inputPeerUser',
            user_id: leomatchPeer.id,
            access_hash: leomatchPeer.access_hash,
          },
          ...(offset?.type === 'downloadOlder' && { offset_id: offsetValue }),
          ...(offset?.type === 'downloadNewer' && { min_id: offsetValue }),
          limit: pageSize
        })
        if(abortSignal) break

        const messages = history.messages

        if(offsetValue === undefined || offset !== undefined) max = history.count
          
        offsetValue = history.messages[history.messages.length - 1].id
        exportedMessagesCount += messages.length
        callback?.(exportedMessagesCount, max, offsetValue ?? 0)
        console.log('Saved', exportedMessagesCount, 'messages')
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
      if(exportedMessagesCount >= max) finishedCallback?.()
      resolve()
    }),
    abort: () => { abortSignal = true }
  }
}

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
