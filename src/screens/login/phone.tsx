import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { Button, StyleSheet, TextInput, Text, View } from 'react-native'

import { subscribeEffect, usingElectron, electron } from '../../electron-wrapper'
import { useNavigation } from '@react-navigation/native'

export default function LoginPhoneScreen() {
  const [phone, setPhone] = React.useState('')
  const navigation = useNavigation()

  const sendCode = () => {
    if(usingElectron) {
      electron.ipcRenderer.send('login_phone', phone)
    } else {
      
    }
  }

  React.useEffect(subscribeEffect('login_phone_result', () => {
    navigation.push('LoginCode')
  }), [])

  return (
    <View style={{ display: 'flex', flexDirection: 'column' }}>
      <Text>Привет!</Text>
      <Text>Введи номер телефона от Telegram</Text>
      <TextInput value={phone} onChangeText={setPhone} style={{ borderStyle: 'solid', borderColor: 'black', borderWidth: 1 }} />
      <Button onPress={sendCode} title='Войти' />
      <StatusBar style="auto" />
    </View>
  )
}