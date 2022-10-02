import MTProto from '@mtproto/core/envs/react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { callMiddleware } from './initializers'

export const initializeAPI = async () => {
  const apiID = await AsyncStorage.getItem('app_api_id')
  const apiHash = await AsyncStorage.getItem('app_api_hash')
  if(apiID === null || apiHash === null) throw 'API_ID or API_HASH is not specified in app settings'
  if(global.api) return
  const api = new MTProto({
    // test: true,
    api_id: Number(apiID),
    api_hash: apiHash
  })
  callMiddleware(api)
  global.api = api
}
export let api