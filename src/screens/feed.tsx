import React from 'react'
import { View, Image } from 'react-native'
import { Text, Button } from 'react-native-paper'
import Container from '../Container'
import { useNavigation } from '@react-navigation/native'
import { resetNavigation } from '../../utils'
import { getSelfPhoto, getUser } from '../../mtproto/utils'
import styles from '../styles/Feed'
import LoadHistory from '../components/Feed/LoadHistory'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { MessageRealmContext } from '../models'
import RealtimeProfile from '../components/Feed/RealtimeProfile'

export default function FeedScreen() {
  const navigation = useNavigation()
  const [user, setUser] = React.useState<object | null>(null)
  const [profilePictureBase64, setProfilePictureBase64] = React.useState<string | null>(null)
  const [state, setState] = React.useState<'setup' | 'ready' | null>(null)
  const realm = MessageRealmContext.useRealm()

  console.log(realm.objects('Message').filtered('info["response"] = "dislike"'))

  React.useEffect(() => {
    if(navigation.getState().routes.length > 1)
      resetNavigation(navigation, 'Feed')
  }, [])

  React.useEffect(() => {
    fetchUser()
    checkState()
  }, [])

  const fetchUser = async () => {
    const users = await getUser()
    if(!users) return 
    const user = users['users'][0]
    setUser(user)

    const photoID = user['photo']['photo_id']
    if(photoID) {
      const profilePhotoBuffer = await getSelfPhoto(photoID)
      console.log(profilePhotoBuffer.length)
      setProfilePictureBase64('data:image/jpeg;base64,' + profilePhotoBuffer.toString('base64'))
    }
  }

  const checkState = async () => {
    const setupState = await AsyncStorage.getItem('init_history_export_state')
    if(setupState === 'finished') {
      setState('ready')
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
      {state === 'ready' && <RealtimeProfile />}
      <Button 
        mode='outlined'
        onPress={() => _dev_clearStorage()}
        style={{ marginTop: 10 }}
      >[[ Clear messages storage ]]</Button>
    </Container>
  )
}