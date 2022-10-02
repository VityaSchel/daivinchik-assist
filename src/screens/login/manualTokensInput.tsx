import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { View, Linking } from 'react-native'
import { Text, Button, HelperText, TextInput } from 'react-native-paper'
import { subscribeEffect, electron, usingElectron } from '../../electron-wrapper'
import { loginWithCode as loginWithMyTelegramCode } from '../../../mytelegramorg/scraping'
import { useNavigation, useRoute } from '@react-navigation/native'
import Container from '../../Container'
import styles from '../../styles/Login'
import Info from '../../components/Login/Info'

export default function ManualTokensInput() {
  const [code, setCode] = React.useState<string>('')
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)
  const navigation = useNavigation()
  const route = useRoute()
  const { phone, random_hash } = route.params ?? {}

  const sendCode = async () => {
    if(!code) return setError('Введи код в поле выше')
    setError(null)
    setLoading(true)

    const result = await loginWithMyTelegramCode(phone, random_hash, code)
    setLoading(false)
    if(result.error) {
      setError({
        'incorrect_code': 'Неправильный код'
      }[result.error] ?? result.error)
    } else {
      console.log(result)
      navigation.push('LoginCode')
    }
  }

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
            placeholder='h25jozhmqjf2y85v064dcl4v289def83'
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