type Peer = { id: string, access_hash: string }

export async function findLeomatchPeer(): Promise<{ error: 'unable_to_resolve_peer' } | { peer: Peer, error: null }> {
  // try {
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
  // } catch(e) {
  //   if(e['error_message'] === 'USERNAME_NOT_OCCUPIED') {
  //     return {}
  //   }
  // }
}

export async function exportHistory(leomatchPeer: Peer, callback: (exported: number) => any, offset_?: number) {
  const pageSize = 100
  let offset = Number.isInteger(offset_) ? offset_ : undefined

  const history = await global.api.call('messages.getHistory', {
    peer: {
      _: 'inputPeerUser',
      user_id: leomatchPeer.id,
      access_hash: leomatchPeer.access_hash,
    },
    offset_id: offset,
    limit: pageSize
  })
  if(offset === undefined) offset = pageSize
  else offset += pageSize
  callback(offset)

  console.log(history)
}