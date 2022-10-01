import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { Button, StyleSheet, TextInput, Text, View } from 'react-native'
// import { ipcRenderer } from 'electron'
import { useNavigation } from '@react-navigation/native'

let electron
if(false) {
  electron = import('electron')
}

export default function LoginPhoneScreen() {
  const [phone, setPhone] = React.useState('')
  const navigation = useNavigation()

  // React.useEffect(() => {
  //   const callback = () => {
  //     navigation.push('LoginCode')
  //   }

  //   ipcRenderer.on('login_phone_result', callback)

  //   return () => {
  //     ipcRenderer.removeListener('login_phone_result', callback)
  //   }
  // }, [])

  return (
    <View style={{ display: 'flex', flexDirection: 'column' }}>
      <Text>Привет!</Text>
      <Text>Введи номер телефона от Telegram</Text>
      <TextInput value={phone} onChangeText={setPhone} style={{ borderStyle: 'solid', borderColor: 'black', borderWidth: 1 }} />
      <Button /*onPress={() => ipcRenderer.send('login_phone', phone)}*/ title='Войти' />
      <StatusBar style="auto" />
    </View>
  )
}