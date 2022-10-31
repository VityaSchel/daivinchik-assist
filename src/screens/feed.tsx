import React from 'react'
import { View, Image, ToastAndroid } from 'react-native'
import { Text, Button } from 'react-native-paper'
import Container from '../Container'
import { useNavigation } from '@react-navigation/native'
import { resetNavigation } from '../../utils'
import { findLeomatchPeer, getSelfPhoto, getUser } from '../../mtproto/utils'
import styles from '../styles/Feed'
import LoadHistory from '../components/Feed/LoadHistory'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { MessageRealmContext } from '../models'
import RealtimeProfile from '../components/Feed/RealtimeProfile'
import { getLatestMessage } from '../../mtproto'
import { Message } from '../models/Message'
import { exportHistory } from '../../mtproto/importBotHistory'

export default function FeedScreen() {
  const navigation = useNavigation()
  const [user, setUser] = React.useState<object | null>(null)
  const [profilePictureBase64, setProfilePictureBase64] = React.useState<string | null>(null)
  const [state, setState] = React.useState<'setup' | 'update' | 'ready' | null>(null)
  const stateRef = React.useRef<typeof setState>()
  const realm = MessageRealmContext.useRealm()

  React.useEffect(() => {
    if(navigation.getState().routes.length > 1)
      resetNavigation(navigation, 'Feed')
  }, [])

  React.useEffect(() => {
    fetchUser()
    checkState()
  }, [])

  React.useEffect(() => { stateRef.current = setState }, [setState])

  const fetchUser = async () => {
    const users = await getUser()
    if(!users) return 
    const user = users['users'][0]
    setUser(user)

    const photoID = user['photo']['photo_id']
    if(photoID) {
      const profilePhotoBuffer = await getSelfPhoto(photoID)
      setProfilePictureBase64('data:image/jpeg;base64,' + profilePhotoBuffer.toString('base64'))
    }
  }

  const checkState = async () => {
    const setupState = await AsyncStorage.getItem('init_history_export_state')
    if(setupState === 'finished') {
      const savedLatestMessage: Message | undefined = realm.objects('Message').sorted([['messageID', true]]).slice(0, 1)[0] as Message | undefined
      if(!savedLatestMessage) {
        setState('setup')
        return
      }
      const actualLatestMessage = await getLatestMessage()
      if(!actualLatestMessage) {
        setState('ready')
        return
      }
      if(savedLatestMessage.messageID < actualLatestMessage.id) {
        console.log('Missed', actualLatestMessage.id - savedLatestMessage.messageID, 'messages. Actualizing...')
        setState('update')
        const result = await findLeomatchPeer()
        if(result.error !== null) {
          ToastAndroid.show(`Ошибка во время обработки: ${result.error}`, 1)
        } else {
          // const finishedDownloading = () => {
          //   console.log('finished', stateRef.current)
          //   stateRef.current?.('ready')    
          // }
          await exportHistory(result.peer, undefined, { type: 'downloadNewer', value: savedLatestMessage.messageID }).promise
          setState('ready')
        }
      } else {
        setState('ready')
      }
    } else {
      setState('setup')
    }
  }

  const _dev_clearStorage = async () => {
    await AsyncStorage.removeItem('init_history_export_state')
    await AsyncStorage.removeItem('init_history_exported_msgs_process')
    realm.write(() => {
      realm.delete(realm.objects('Message'))
    })
    navigation.reset({ routes: [{ name: 'Feed' }], index: 0 })
  }
  
  if(!user) return <View></View>

  return (
    <Container>
      <View style={styles.userInfo}>
        {profilePictureBase64 && <Image style={styles.pfp} source={{ uri: profilePictureBase64, width: 30, height: 30 }} />}
        <Text variant='bodyMedium' style={{ marginRight: 5 }}>{user['first_name']}</Text>
        <Text variant='bodyMedium'>{user['last_name']}</Text>
        <Button 
          mode='text' 
          compact 
          onPress={() => {}}
          style={styles.logout}
        >Выйти</Button>
      </View>
      {state === 'setup' && <LoadHistory onDone={checkState} />}
      {state === 'update' && (<View style={styles.updating}>
        <Text variant='bodyLarge'>История подгружается...</Text>
        <Text variant='bodyMedium' style={styles.text}>
          Загрузка и анализ новых сообщений, которые появились с момента выхода из Дайвинчик Ассист. Пожалуйста, подождите.
        </Text>
      </View>)}
      {state === 'ready' && <RealtimeProfile />}
      {process.env.NODE_ENV === 'development' && <Button 
        mode='outlined'
        onPress={() => _dev_clearStorage()}
        style={{ marginTop: 400 }}
      >[[ Clear messages storage ]]</Button>}
      
    </Container>
  )
}