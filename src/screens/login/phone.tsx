import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, View } from 'react-native'
import { Text, Button, HelperText, TextInput } from 'react-native-paper'
import { subscribeEffect, usingElectron, electron } from '../../electron-wrapper'
import { useNavigation } from '@react-navigation/native'
import Container from '../../Container'

export default function LoginPhoneScreen() {
  const [phone, setPhone] = React.useState('')
  const [error, setError] = React.useState(null)
  const navigation = useNavigation()

  const sendCode = () => {
    if(usingElectron) {
      electron.ipcRenderer.send('login_phone', phone)
    } else {

    }
  }

  React.useEffect(subscribeEffect('login_phone_result', (_, data: { phone_code_hash: string }) => {
    console.log(data)
    if(data.error) {
      setError(data.error)
    } else {
      navigation.push('LoginCode')
    }
  }), [])

  return (
    <Container>
      <Text variant="headlineLarge" style={{ fontWeight: 'bold' }}>Привет!</Text>
      <Text>Введи номер телефона от Telegram</Text>
      <TextInput placeholder='Например, +79019404698' value={phone} onChangeText={setPhone} error={Boolean(error)} />
      <HelperText type='error' visible={Boolean(error)}>{error}</HelperText>
      <Button mode='contained' onPress={sendCode}>Войти</Button>
      <StatusBar style="auto" />
    </Container>
  )
}