import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { Button, StyleSheet, TextInput, Text, View } from 'react-native'
// import { ipcRenderer } from 'electron'

export default function LoginPhoneScreen() {
  const [code, setCode] = React.useState('')

  return (
    <View>
      <Text>Введи код, который пришел тебе в Telegram</Text>
      <TextInput value={code} onChangeText={setCode} />
      <Button /*onPress={() => ipcRenderer.send('login_code', code)}*/ title='Отправить' />
      <StatusBar style="auto" />
    </View>
  )
}