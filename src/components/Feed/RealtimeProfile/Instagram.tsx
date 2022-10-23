import React from 'react'
import { ScrollView, View } from 'react-native'
import { Text } from 'react-native-paper'
import type { ProfileType } from './index'
import styles from './styles'
import { WebView } from 'react-native-webview'

const instagramMatchInProfile = /(inst|insta|инст|инста|инсте|инстаграме?)(: ?| ?- ?| ?– ?| ?— ?| )([a-zA-Z0-9._]{3,30})/i

export default function Instagram(props: { data: ProfileType }) {
  const instagramUsernameHandle = props.data.text?.match(instagramMatchInProfile)?.[3]

  return (
    <View style={styles.interactions}>
      <Text variant='titleMedium'>Instagram профиль:</Text>
      <View style={styles.instagramContainer}>
        {instagramUsernameHandle
          ? (
            <>
              <WebView
                source={{ uri: `https://instagram.org/${instagramUsernameHandle}` }}
              />
              <Text>@{instagramUsernameHandle}</Text>
            </>
          ) : (
            <Text>Не найден в тексте анкеты</Text>
          )
        }
      </View>
    </View>
  )
}