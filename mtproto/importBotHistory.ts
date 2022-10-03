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

export async function exportHistory(leomatchPeer: Peer, callback: (exported: number, max: number, offset: number) => any, offset_?: number) {
  const pageSize = 5
  const messagesList = []
  let offset = Number.isInteger(offset_) ? offset_ : undefined
  let max

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
    const messages = history.messages
    console.log('Saved', messages.length, 'messages')

    if(offset === undefined) max = history.count

    if(messages.length > 0) {
      offset = messages[messages.length - 1].id
    }

    callback(messagesList.length, max, offset ?? 0)
    
    if(messages.length > 0)
      messagesList.push(...messages)
    else
      break

  } while(messagesList.length < max && messagesList.length < 10)

  console.log(JSON.stringify(messagesList))
}