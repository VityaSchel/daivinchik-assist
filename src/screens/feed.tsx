import React from 'react'
import { View, Image } from 'react-native'
import { Text, Button } from 'react-native-paper'
import Container from '../Container'
import { useNavigation } from '@react-navigation/native'
import { resetNavigation } from '../../utils'
import { getSelfPhoto, getUser } from '../../mtproto/utils'
import styles from '../styles/Feed'

export default function FeedScreen() {
  const navigation = useNavigation()
  const [user, setUser] = React.useState<object | null>(null)
  const [profilePictureBase64, setProfilePictureBase64] = React.useState<string | null>(null)

  React.useEffect(() => {
    if(navigation.getState().routes.length > 1)
      resetNavigation(navigation, 'Feed')
  }, [])

  React.useEffect(() => {
    fetchUser()
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
  
  if(!user) return <View></View>

  return (
    <Container>
      <View style={styles.userInfo}>
        {profilePictureBase64 && <Image style={styles.pfp} source={{ uri: profilePictureBase64, width: 30, height: 30 }} />}
        <Text variant='bodyMedium'>{user['first_name']} {user['last_name']}</Text>
        <Button 
          mode='text' 
          compact 
          onPress={() => {}}
          style={styles.logout}
        >Выйти</Button>
      </View>
    </Container>
  )
}