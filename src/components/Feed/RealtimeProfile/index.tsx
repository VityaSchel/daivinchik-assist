import React from 'react'
import { View } from 'react-native'
import { Text } from 'react-native-paper'
import { onMessage } from '../../../../mtproto/updates'
import { getPhoto } from '../../../../mtproto/utils'
import { detectMessageType, userProfileRegex } from '../../../models/Message'
import { Message } from '../../../ts/MessageSchema'
import styles from './styles'

type ProfileType = {
  picture: { id: string, base64: null | string }
  name: string
  age: number
  place: string
  text?: string
  personalMessage?: string
}

export default function RealtimeProfile() {
  const [profile, setProfile] = React.useState<null | ProfileType>(null)

  React.useEffect(() => {
    const callback = onMessage(newMessage)
    return () => { global.api.updates.off('updates', callback) }
  }, [])

  const newMessage = (message: Message) => {
    switch(detectMessageType(message)) {
      case 'candidate_profile':
        setProfile(parseProfile(message))
        break

      default:
        setProfile(null)
        break
    }
  }

  const parseProfile = (message: Message): ProfileType | null => {
    const matchResults = message.message.match(new RegExp(userProfileRegex))
    if(!matchResults) return null
    
    const picture = message.media['photo']
    loadPhoto(picture)
    return {
      picture: { id: picture.id, base64: null },
      name: matchResults[1],
      age: Number(matchResults[2]),
      place: matchResults[3],
      text: matchResults[5],
      personalMessage: matchResults[7]
    }
  }

  const loadPhoto = async (picture: object) => {
    const pictureBuffer = await getPhoto(picture['id'], picture['access_hash'], picture['file_reference'])
    if(profile?.picture.id === picture['id']) {
      'data:image/jpeg;base64,' +  pictureBuffer.toString('base64')
    } else {
      console.log('outdated', profile)
    }
  }

  return (
    <View>
      {profile !== null
        ? <Profile data={profile} />
        : <Pending />
      }
    </View>
  )
}

function Profile(props: { data: ProfileType }) {
  return (
    <View>

    </View>
  )
}

function Pending() {
  return (
    <View style={styles.pending}>
      <Text variant='labelLarge' style={styles.pending.title}>Продолжайте листать анкеты</Text>
      <Text variant='labelMedium'>Здесь будет информация о профиле</Text>
    </View>
  )
}