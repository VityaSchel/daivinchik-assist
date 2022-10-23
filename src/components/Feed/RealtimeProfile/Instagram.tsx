import React from 'react'
import { View } from 'react-native'
import { ActivityIndicator, IconButton, Text } from 'react-native-paper'
import type { ProfileType } from './index'
import { WebView } from 'react-native-webview'
import styles from './styles'
import * as Linking from 'expo-linking'

const instagramMatchInProfile = /(inst|insta|инст|инста|инсте|инстаграме?)(: ?| ?- ?| ?– ?| ?— ?| )([a-zA-Z0-9._]{3,30})/i

export default function Instagram(props: { data: ProfileType }) {
  const instagramUsernameHandle = props.data.text?.match(instagramMatchInProfile)?.[3]
  const [browserKey, setBrowserKey] = React.useState(Date.now())

  const openInBrowser = () => {
    Linking.openURL(`https://instagram.com/${instagramUsernameHandle}`)
  }

  const refresh = () => {
    setBrowserKey(Date.now())
  }

  return (
    <View style={styles.instagram}>
      <View style={styles.instagramTitle}>
        <Text variant='titleMedium'>Instagram профиль:</Text>
        {instagramUsernameHandle && (
          <View style={styles.instagramActions}>
            <IconButton icon='open-in-new' size={20} onPress={openInBrowser} />
            <IconButton icon='reload' size={20} onPress={refresh} />
          </View>
        )}
      </View>
      <View>
        {instagramUsernameHandle
          ? (
            <>
              <Profile handle={instagramUsernameHandle} key={browserKey} />
              {/* <Text>@{instagramUsernameHandle}</Text> */}
            </>
          ) : (
            <Text>Не найден в тексте анкеты</Text>
          )
        }
      </View>
    </View>
  )
}

function Profile(props: { handle: string }) {
  const profileURI = `https://www.instagram.com/${props.handle}/`

  const injectedCssStyles = `
    nav, [role=menu], footer, article > div + * {
      display: none !important;
    }
  `

  const injectedJsCode = `(function() {
    const style = document.createElement('style')
    style.type = 'text/css'
    style.appendChild(document.createTextNode(\`${injectedCssStyles}\`))
    document.head.appendChild(style)
  })();`

  return (
    <View style={styles.instagramContainer}>
      <WebView
        source={{ uri: profileURI }}
        startInLoadingState
        renderLoading={() => <ActivityIndicator />}
        onNavigationStateChange ={() => false}
        onShouldStartLoadWithRequest ={(request) => {
          // Prevent login redirecting
          return request.url === profileURI
        }}
        injectedJavaScript={injectedJsCode}
      />
    </View>
  )
}