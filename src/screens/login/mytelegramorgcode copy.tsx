import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { View, Linking } from 'react-native'
import { Text, Button, HelperText, TextInput } from 'react-native-paper'
import { subscribeEffect, electron, usingElectron } from '../../electron-wrapper'
import { sendCode as sendCodeToMyTelegramOrg } from '../../../mytelegramorg/scraping'
import { useNavigation, useRoute } from '@react-navigation/native'
import Container from '../../Container'
import styles from '../../styles/Login'
import Info from '../../components/Login/Info'

export default function LoginPhoneScreen() {
  const [code, setCode] = React.useState<string>('')
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [aboutDialogVisible, setAboutDialogVisible] = React.useState(false)
  const navigation = useNavigation()
  const route = useRoute()
  const { phone, random_hash } = route.params ?? {}

  const sendCode = async () => {
    if(!phone) return setError('Введи телефон в поле выше')
    if(!phone.startsWith('+')) return setError('Телефон должен начинаться со знака +')
    setError(null)
    setLoading(true)
    // if(usingElectron) {
    //   electron.ipcRenderer.send('my_telegram_login_phone', phone)
    // } else {

    // }
    const result = await sendCodeToMyTelegramOrg(phone)
    setLoading(false)
    if(result.error) {
      setError({
        'too_many_tries': 'Слишком много попыток или некорректный формат телефона'
      }[result.error] ?? result.error)
    } else {
      console.log(result)
      navigation.push('LoginCode')
    }
  }

  // React.useEffect(subscribeEffect('login_phone_result', (_, data: { phone_code_hash?: string, error: string | null }) => {
  //   console.log(data)
  //   setLoading(false)
  //   if(data.error) {
  //     setError({
  //       'phone_number_invalid': 'Некорректный формат номера телефона' 
  //     }[data.error] ?? data.error)
  //   } else {
  //     navigation.push('LoginCode')
  //   }
  // }), [])

  return (
    <Container>
      <StatusBar style="auto" />
      <View style={styles.container} data-a='1'>
        <View style={styles.innerContainer}>
          <Text variant="headlineLarge" style={{ fontWeight: 'bold' }}>{phone}</Text>
          <Text style={{ marginVertical: 10 }}>Введи код, который пришел тебе в Telegram</Text>
          <TextInput
            value={code} 
            onChangeText={setCode} 
            error={Boolean(error)} 
            placeholder='Код'
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
            onPress={sendCode} 
            style={styles.button}
            disabled={loading}
          >
            Не приходит код?
          </Button>
          <Info />
        </View>
      </View>
    </Container>
  )
}