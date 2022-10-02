import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { View, Linking } from 'react-native'
import { Text, Button, HelperText, TextInput } from 'react-native-paper'
import { subscribeEffect, electron, usingElectron } from '../../electron-wrapper'
import { loginWithCode as loginWithMyTelegramCode } from '../../../mytelegramorg/scraping'
import { useNavigation, useRoute } from '@react-navigation/native'
import Container from '../../Container'
import styles from '../../styles/Login'
import Info from '../../components/Login/Info'
import { resetNavigation, resetNavigationWithHistory } from '../../../utils'

export default function MyTelegramLoginScreen() {
  const [code, setCode] = React.useState<string>('')
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)
  const navigation = useNavigation()
  const route = useRoute()
  const { phone, random_hash } = route.params ?? {}

  React.useEffect(
    () => navigation.addListener('beforeRemove', (e) => { if (loading) e.preventDefault() }),
    [navigation, loading]
  )

  const sendCode = async () => {
    if(!code) return setError('Введи код в поле выше')
    setError(null)
    setLoading(true)

    const result = await loginWithMyTelegramCode(phone, random_hash, code)
    setLoading(false)
    if(result.error) {
      setError({
        'incorrect_code': 'Неправильный код',
        'cookie_not_found': 'Не удалось получить токен сессии для my.telegram.org. Возможно, версия этого приложения устарела, а возможно, Telegram изменил метод работы сайта. Введите токены вручную (нажмите кнопку Подробнее)'
      }[result.error] ?? result.error)
    } else {
      resetNavigationWithHistory(navigation, [{ name: 'LoginPhone' }, { name: 'SearchingTokens', params: { phone, sessionToken: result.sessionToken } }])
    }
  }

  return (
    <Container>
      <StatusBar style="auto" />
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <Text variant="headlineLarge" style={{ fontWeight: 'bold' }}>{phone}</Text>
          <Text variant="headlineSmall" style={{ fontWeight: 'bold' }}>Получение токенов</Text>
          <Text style={{ marginVertical: 10 }}>Введи код, который пришел тебе в Telegram</Text>
          <TextInput
            value={code} 
            onChangeText={setCode} 
            error={Boolean(error)} 
            placeholder='Буквенно-числовой код'
            mode='flat'
            disabled={loading}
          />
          {Boolean(error) && <HelperText type='error' visible={Boolean(error)}>{error}</HelperText>}
          <Button 
            mode='contained'
            onPress={sendCode} 
            style={styles.button}
            disabled={loading}
          >
            Отправить
          </Button>
          <Button 
            mode='outlined'
            style={styles.button}
            disabled={loading}
            onPress={() => resetNavigationWithHistory(navigation, [{ name: 'LoginPhone' }, { name: 'ManualTokensInput', params: { phone: phone } }])}
          >
            Не приходит код?
          </Button>
          <Info disabled={loading} />
        </View>
      </View>
    </Container>
  )
}