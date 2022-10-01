import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { Button, StyleSheet, TextInput, Text, View } from 'react-native'
import electron from 'electron'
import { useNavigation } from '@react-navigation/native'

const usingElectron = false

export default function LoginPhoneScreen() {
  const [phone, setPhone] = React.useState('')
  const navigation = useNavigation()

  React.useEffect(() => {
    if(usingElectron) {
      const callback = () => {
        navigation.push('LoginCode')
      }

      electron.ipcRenderer.on('login_phone_result', callback)

      return () => {
        electron.ipcRenderer.removeListener('login_phone_result', callback)
      }
    }
  }, [])

  return (
    <View style={{ display: 'flex', flexDirection: 'column' }}>
      <Text>Привет!</Text>
      <Text>Введи номер телефона от Telegram</Text>
      <TextInput value={phone} onChangeText={setPhone} style={{ borderStyle: 'solid', borderColor: 'black', borderWidth: 1 }} />
      <Button onPress={() => usingElectron && electron.ipcRenderer.send('login_phone', phone)} title='Войти' />
      <StatusBar style="auto" />
    </View>
  )
}