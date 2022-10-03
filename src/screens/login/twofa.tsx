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
import { enterTwoFACode } from '../../../mtproto'

export default function TwoFaLoginScreen() {
  const [password, setPassword] = React.useState<string>('')
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)
  const navigation = useNavigation()

  const sendCode = async () => {
    if(!password) return setError('Введи пароль в поле выше')
    setError(null)
    setLoading(true)
    // if(usingElectron) {
    //   electron.ipcRenderer.send('my_telegram_login_phone', phone)
    // } else {

    // }
    const result = await enterTwoFACode(password)
    setLoading(false)
    if(!result.success) {
      setError({
        'incorrect_2fa': 'Неправильный пароль'
      }[result.error] ?? result.error)
    } else {
      navigation.push('Feed')
    }
  }

  return (
    <Container>
      <StatusBar style="auto" />
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <Text variant="headlineLarge" style={{ fontWeight: 'bold' }}>Двухэтапная аутентификация</Text>
          <Text style={{ marginVertical: 10 }}>Введи пароль от своего аккаунта</Text>
          <TextInput
            value={password} 
            onChangeText={setPassword} 
            error={Boolean(error)} 
            placeholder='Пароль'
            mode='flat'
            disabled={loading}
            secureTextEntry
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
          <Info />
        </View>
      </View>
    </Container>
  )
}