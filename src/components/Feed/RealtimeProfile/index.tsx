import React from 'react'
import { Image, ScrollView, View } from 'react-native'
import { Button, Text } from 'react-native-paper'
import { onMessage } from '../../../../mtproto/updates'
import { getPhoto } from '../../../../mtproto/utils'
import { detectMessageType, Message, MessageFields, userProfileRegex } from '../../../models/Message'
import { Message as MTProtoMessage } from '../../../ts/MessageSchema'
import styles from './styles'
import { Placeholder, PlaceholderMedia, PlaceholderLine, Fade } from 'rn-placeholder'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { MessageRealmContext } from '../../../models'
import { format } from 'date-fns'
import { default as dateFnsRu } from 'date-fns/locale/ru'

type ProfileType = {
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
    const callback = onMessage(newMessage)
    return () => { global.api.updates.off('updates', callback) }
  }, [])

  const newMessage = (message: MTProtoMessage) => {
    console.log(message)
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
      {/* {process.env.NODE_ENV === 'development' && (
        <Button 
          mode='outlined'
          onPress={() => { realm.write(() => realm.objects('Message', Message.generate({"_": "message", "date": 1666543945, "edit_hide": false, "flags": 131584, "from_scheduled": false, "grouped_id": "13332351565913690", "id": 11385, "legacy": false, "media": {"_": "messageMediaPhoto", "flags": 1, "photo": {"_": "photo", "access_hash": "2022908885812767181", "date": 1666200790, "dc_id": 2, "file_reference": [], "flags": 0, "has_stickers": false, "id": "5368747569003481200", "sizes": [Array]}}, "media_unread": false, "mentioned": false, "message": "вова, 15, Самара – Омг", "noforwards": false, "out": false, "peer_id": {"_": "peerUser", "user_id": "1234060895"}, "pinned": false, "post": false, "silent": false}))) }}
        >[[ Add to DB ]]</Button>
      )} */}
    </View>
  )
}

function Profile(props: { data: ProfileType }) {
  return (
    <View>
      <MiniProfile data={props.data} />
      <InteractionsHistory data={props.data} />
    </View>
  )
}

function MiniProfile(props: { data: ProfileType }) {
  const pfpURI = props.data.picture

  return (
    <View style={styles.miniProfile}>
      {pfpURI
        ? <Image style={styles.pfp} source={{ uri: pfpURI, width: 100, height: 100 }} />
        : <Placeholders />
      }
      <View style={styles.info}>
        <Text variant='titleLarge' style={styles.bold}>{props.data.name}</Text>
        <Text variant='bodyLarge' style={styles.bold}><Icon name='map-marker' size={15} /> {props.data.place}</Text>
        <Text variant='bodyLarge' style={styles.infoAge}>{props.data.age} лет</Text>
        <Text variant='bodyMedium' style={styles.infoText} numberOfLines={1}>{props.data.text}</Text>
      </View>
    </View>
  )
}

function InteractionsHistory(props: { data: ProfileType }) {
  const realm = MessageRealmContext.useRealm()
  const history = realm.objects('Message')
    .filtered('text = $0', props.data.fullText)
    .sorted([['messageID', true]]) as unknown as MessageFields[]
  console.log(history)

  return (
    <View style={styles.interactions}>
      <Text variant='titleMedium'>История взаимодействий:</Text>
      <ScrollView style={styles.history}>
        {history.length === 0
          ? <Text variant='bodyMedium'>Вы еще не встречали эту анкету</Text>
          : history.map(entry => (
            <View style={styles.historyEntry} key={entry._id.toHexString()}>
              <Text><Icon name='calendar-account'/> {format(entry.date * 1000, 'dd MMMM yyyy, HH:mm', { locale: dateFnsRu })}</Text>
              <Text>Вы {{'liked': '❤️ лайкнули', 'disliked': '👎 дизлайкнули'}[entry.info.response]??'💤 пропустили'} анкету</Text>
            </View>
          ))
        }
      </ScrollView>
    </View>
  )
}

function Placeholders() {
  return (
    <Placeholder
      Animation={Fade}
      style={styles.pfpPlaceholder}
    >
      <PlaceholderMedia size={100} style={{ borderRadius: 15 }} />
    </Placeholder>
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