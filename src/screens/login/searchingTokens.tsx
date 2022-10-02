import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { View } from 'react-native'
import { Text, HelperText } from 'react-native-paper'
import { useNavigation, useRoute } from '@react-navigation/native'
import Container from '../../Container'
import styles from '../../styles/Login'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { obtainTokens } from '../../../mytelegramorg/scraping'
import { resetNavigationWithHistory } from '../../../utils'
import { initializeAPI } from '../../../mtproto/react-native'
import { sendLoginCode } from '../../../mtproto'

export default function SearchingTokens() {
  const navigation = useNavigation()
  const route = useRoute()
  const { phone, sessionToken } = route.params ?? {}
  const [state, setState] = React.useState<'obtaining_tokens' | 'sending_code'>('obtaining_tokens')
  const [error, setError] = React.useState<null | string>(null)

  React.useEffect(
    () => navigation.addListener('beforeRemove', (e) => { e.preventDefault() }),
    [navigation]
  )

  React.useEffect(() => {
    if(!phone || !sessionToken) return
    obtainTokens(sessionToken)
      .then(async (data) => {
        setState('sending_code')
        try {
          await AsyncStorage.setItem('app_api_id', data.appID)
          await AsyncStorage.setItem('app_api_hash', data.appHash)
          await initializeAPI()
          const result = await sendLoginCode(phone)
          if(result.error) {
            setError(result.error)
          } else {
            navigation.push('LoginCode', { phone, phone_code_hash: result.phone_code_hash })
          }
        } catch(e) {
          setError(JSON.stringify(e))
        }
      })
      .catch((err) => {
        console.error(err)
      })
  }, [sessionToken])

  return (
    <Container>
      <StatusBar style="auto" />
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <Text variant="headlineLarge" style={{ fontWeight: 'bold' }}>{phone}</Text>
          <Text variant="headlineSmall" style={{ fontWeight: 'bold' }}>Получение токенов</Text>
          {Boolean(error) && <HelperText type='error' visible={Boolean(error)}>{error}</HelperText>}
          {!error && <Text style={{ marginVertical: 10 }}>
            {{
              'obtaining_tokens': 'Распознавание токенов... Подожди немного',
              'sending_code': 'Отправка кода...'
            }[state]}
          </Text>}
        </View>
      </View>
    </Container>
  )
}