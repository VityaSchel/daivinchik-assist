import React from 'react'
import { Image, ScrollView, useWindowDimensions, View } from 'react-native'
import { Button, Text } from 'react-native-paper'
import { onMessage } from '../../../../mtproto/updates'
import { getPhoto } from '../../../../mtproto/utils'
import { detectMessageType, Message, MessageFields, userProfileRegex } from '../../../models/Message'
import { Message as MTProtoMessage } from '../../../ts/MessageSchema'
import { defaultStyles, compactStyles } from './styles'
import { Placeholder, PlaceholderMedia, PlaceholderLine, Fade } from 'rn-placeholder'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { MessageRealmContext } from '../../../models'
import InteractionsHistory from './InteractionsHistory'
import Instagram from './Instagram'
import { getLatestMessage } from '../../../../mtproto'
import useResponsiveStyles from '../../hooks/useResponsiveStyles'

export type ProfileType = {
  picture: null | string
  name: string
  age: number
  place: string
  fullText: string
  text?: string
  personalMessage?: string
}


export default function RealtimeProfile() {
  const [profile, setProfile] = React.useState<null | ProfileType>(null)
  const [profilePicture, setProfilePicture] = React.useState<null | string>(null)
  const realm = MessageRealmContext.useRealm()
  
  React.useEffect(() => {
    getLatestMessage().then(latestMsg => latestMsg !== undefined && newMessage(latestMsg))
    const callback = onMessage(newMessage)
    return () => { global.api.updates.off('updates', callback) }
  }, [])

  const newMessage = (message: MTProtoMessage) => {
    switch(detectMessageType(message)) {
      case 'candidate_profile':
        setProfile(parseProfile(message))
        break

      default:
        if(message.grouped_id !== undefined && message.message === '' && message.media !== undefined) {
          return
        }

        setProfile(null)
        setProfilePicture(null)
        break
    }
  }

  const parseProfile = (message: MTProtoMessage): ProfileType | null => {
    const matchResults = message.message.match(new RegExp(userProfileRegex))
    if(!matchResults) return null
    
    const picture = message.media['photo']
    loadPhoto(picture)
    return {
      picture: null,
      name: matchResults[1],
      age: Number(matchResults[2]),
      place: matchResults[3],
      fullText: message.message,
      text: matchResults[5],
      personalMessage: matchResults[7]
    }
  }

  const loadPhoto = async (picture: object) => {
    const pictureBuffer = await getPhoto(picture['id'], picture['access_hash'], picture['file_reference'])
    setProfilePicture('data:image/jpeg;base64,' + pictureBuffer.toString('base64'))
  }

  return (
    <View>
      {profile !== null
        ? <Profile data={{ ...profile, picture: profilePicture }} />
        : <Pending />
      }
    </View>
  )
}

function Profile(props: { data: ProfileType }) {
  return (
    <View>
      <MiniProfile data={props.data} />
      <InteractionsHistory data={props.data} />
      <Instagram data={props.data} />
    </View>
  )
}

function MiniProfile(props: { data: ProfileType }) {
  const pfpURI = props.data.picture
  const styles = useResponsiveStyles(defaultStyles, compactStyles)

  return (
    <View style={styles.miniProfile}>
      {pfpURI
        ? <Image style={styles.pfp} source={{ uri: pfpURI }} />
        : <Placeholders />
      }
      <View style={styles.info}>
        <Text variant='titleLarge' style={styles.name}>{props.data.name}</Text>
        <Text variant='bodyLarge' style={styles.infoPlace}><Icon name='map-marker' size={15} /> {props.data.place}</Text>
        <Text variant='bodyLarge' style={styles.infoAge}>{props.data.age} лет</Text>
        <Text variant='bodyMedium' style={styles.infoText} numberOfLines={1}>{props.data.text}</Text>
      </View>
    </View>
  )
}

function Placeholders() {
  const styles = useResponsiveStyles(defaultStyles, compactStyles)

  return (
    <Placeholder
      Animation={Fade}
      style={styles.pfpPlaceholder}
    >
      <PlaceholderMedia size={styles.pfpPlaceholderSize.width} style={{ borderRadius: 15 }} />
    </Placeholder>
  )
}

function Pending() {
  const styles = useResponsiveStyles(defaultStyles, compactStyles)

  return (
    <View style={styles.pending}>
      <Text variant='labelLarge' style={styles.pending.title}>Продолжайте листать анкеты</Text>
      <Text variant='labelMedium'>Здесь будет информация о профиле</Text>
    </View>
  )
}