import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, View, Linking } from 'react-native'
import { Text, Button, HelperText, TextInput } from 'react-native-paper'
import { subscribeEffect, electron, usingElectron } from '../../electron-wrapper'
import { useNavigation } from '@react-navigation/native'
import Container from '../../Container'
import styles from '../../styles/Login.module.scss'

export default function LoginPhoneScreen() {
  const [phone, setPhone] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)
  const navigation = useNavigation()

  const sendCode = () => {
    if(!phone) return setError('Введи телефон в поле выше')
    if(!phone.startsWith('+')) return setError('Телефон должен начинаться со знака +')
    setError(null)
    setLoading(true)
    if(usingElectron) {
      electron.ipcRenderer.send('login_phone', phone)
    } else {

    }
  }

  React.useEffect(() => {
    if(phone === '8') {
      setPhone('+7')
    }
  }, [phone])

  React.useEffect(subscribeEffect('login_phone_result', (_, data: { phone_code_hash: string }) => {
    console.log(data)
    setLoading(false)
    if(data.error) {
      setError(data.error)
    } else {
      navigation.push('LoginCode')
    }
  }), [])

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
          <Text style={styles.warning}>
            Это приложение работает только на вашем телефоне. 
            Ваши данные никогда не будут отправлены за пределы 
            этого устройства. <Text 
              style={styles.link} 
              onPress={() => Linking.openURL('https://github.com/VityaSchel/daivinchik-assist')}
            >Код приложения на GitHub.</Text>
          </Text>
        </View>
      </View>
    </Container>
  )
}