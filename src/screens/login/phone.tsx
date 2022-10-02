import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { View } from 'react-native'
import { Text, Button, HelperText, TextInput } from 'react-native-paper'
import { sendCode as sendCodeToMyTelegramOrg } from '../../../mytelegramorg/scraping'
import { useNavigation } from '@react-navigation/native'
import Container from '../../Container'
import styles from '../../styles/Login'
import Info from '../../components/Login/Info'
import { resetNavigation, resetNavigationWithHistory } from '../../../utils'
import * as SplashScreen from 'expo-splash-screen'
import { initializeAPI } from '../../../mtproto/react-native'
import { getUser } from '../../../mtproto/utils'

export default function LoginPhoneScreen() {
  const [phone, setPhone] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)
  const navigation = useNavigation()

  const sendCode = async () => {
    if(!phone) return setError('Введи телефон в поле выше')
    if(!phone.startsWith('+')) return setError('Телефон должен начинаться со знака +')
    setError(null)
    setLoading(true)
    
    const result = await sendCodeToMyTelegramOrg(phone)
    setLoading(false)
    if(result.error) {
      setError({
        'too_many_tries': 'Слишком много попыток или некорректный формат телефона'
      }[result.error] ?? result.error)
    } else {
      resetNavigation(navigation, 'MyTelegramLoginCode', { phone, random_hash: result.random_hash })
    }
  }

  React.useEffect(() => {
    if(phone === '8') {
      setPhone('+7')
    }
  }, [phone])

  React.useEffect(() => {
    checkAuthState().then(async state => {
      switch(state) {
        case 'authentificated':
          resetNavigation(navigation, 'Feed')
          break

        case '2fa':
          resetNavigation(navigation, 'TwoFA')
          break

        default: 
          break
      }
      await SplashScreen.hideAsync()
    })
  }, [navigation])

  const checkAuthState = async (): Promise<'authentificated' | 'loggedout' | '2fa'> => {
    try {
      await initializeAPI()
    } catch(e) {
      return false
    }
    const user = await getUser()
    const password = await global.api.call('account.getPassword')
    console.log(password)
    if(password?.current_algo) {
      return '2fa'
    } else {
      if(user !== null) {
        process.env.NODE_ENV === 'development' && console.log('Authentificated as user', user)
        return 'authentificated'
      } else {
        return 'loggedout'
      }
    }
  }

  return (
    <Container>
      <StatusBar style="auto" />
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <Text variant="headlineLarge" style={{ fontWeight: 'bold' }}>Привет!</Text>
          <Text style={{ marginVertical: 10 }}>Введи свой номер телефона от Telegram</Text>
          <TextInput
            value={phone} 
            onChangeText={setPhone} 
            error={Boolean(error)} 
            placeholder='Например, +79019404698'
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
            Войти
          </Button>
          <Info disabled={loading} />
          {process.env.NODE_ENV === 'development' && 
            <Button mode='outlined' style={{ marginTop: 10 }} onPress={() => 
              resetNavigationWithHistory(navigation, [{ name: 'LoginPhone' }, { name: 'MyTelegramLoginCode', params: { phone: '+79019404698', random_hash: '' } }])
            }>[[ Дальше ]]</Button>
          }
        </View>
      </View>
    </Container>
  )
}