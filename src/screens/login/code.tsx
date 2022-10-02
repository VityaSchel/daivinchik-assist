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
import { enterLoginCode } from '../../../mtproto'

export default function LoginPhoneScreen() {
  const [code, setCode] = React.useState<string>('')
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [aboutDialogVisible, setAboutDialogVisible] = React.useState(false)
  const navigation = useNavigation()
  const route = useRoute()
  const { phone, phone_code_hash } = route.params ?? {}

  React.useEffect(
    () => navigation.addListener('beforeRemove', (e) => { if (loading) e.preventDefault() }),
    [navigation, loading]
  )

  const sendCode = async () => {
    setError(null)
    setLoading(true)
    // if(usingElectron) {
    //   electron.ipcRenderer.send('my_telegram_login_phone', phone)
    // } else {
    // } TODO: Replace electron.ipcRenderer.send & subscribeEffect with single request-response method

    const result = await enterLoginCode(phone_code_hash, phone, code)
    setLoading(false)
    if(result.error) {
      if(result.error === '2fa_password_needed') {
        console.log('go to 2fa')
      } else {
        setError({
          'account_not_found': 'Аккаунт не найден',
          'incorrect_code': 'Неправильный код',
          'expired_code': 'Истек срок действия кода'
        }[result.error] ?? result.error)
      }
    } else {
      navigation.push('Feed')
    }
  }

  return (
    <Container>
      <StatusBar style="auto" />
      <View style={styles.container} data-a='1'>
        <View style={styles.innerContainer}>
          <Text variant="headlineLarge" style={{ fontWeight: 'bold' }}>{phone}</Text>
          <Text variant="headlineSmall" style={{ fontWeight: 'bold' }}>Вход в аккаунт</Text>
          <Text style={{ marginVertical: 10 }}>Введи код, который пришел тебе от Telegram</Text>
          <TextInput
            value={code} 
            onChangeText={setCode} 
            error={Boolean(error)} 
            placeholder='Числовой код'
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
          <Info disabled={loading} />
        </View>
      </View>
    </Container>
  )
}