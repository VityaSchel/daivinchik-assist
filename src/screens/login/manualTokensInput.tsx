import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { View, Linking } from 'react-native'
import { Text, Button, HelperText, TextInput } from 'react-native-paper'
import { subscribeEffect, electron, usingElectron } from '../../electron-wrapper'
import { loginWithCode as loginWithMyTelegramCode } from '../../../mytelegramorg/scraping'
import { useNavigation, useRoute } from '@react-navigation/native'
import Container from '../../Container'
import styles from '../../styles/Login'
import { resetNavigation } from '../../../utils'

export default function ManualTokensInput() {
  const [phone, setPhone] = React.useState<string>('')
  const [appID, setAppID] = React.useState<string>('')
  const [appHash, setAppHash] = React.useState<string>('')
  const [error, setError] = React.useState<string | null>(null)
  const navigation = useNavigation()
  const route = useRoute()

  React.useEffect(() => {
    const phone = route.params?.phone
    phone && setPhone(phone)
  }, [route.params])

  // const sendCode = async () => {
  //   if(!code) return setError('Введи код в поле выше')
  //   setError(null)
  //   setLoading(true)

  //   const result = await loginWithMyTelegramCode(phone, random_hash, code)
  //   setLoading(false)
  //   if(result.error) {
  //     setError({
  //       'incorrect_code': 'Неправильный код'
  //     }[result.error] ?? result.error)
  //   } else {
  //     console.log(result)
  //     navigation.push('LoginCode')
  //   }
  // }

  return (
    <Container>
      <StatusBar style="auto" />
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <Text variant="headlineLarge" style={{ fontWeight: 'bold' }}>Ввод токенов</Text>
          <Text style={{ marginVertical: 10 }}>Приложению не удается автоматически распознать токены для MTProto? Введите их вручную в этой форме!</Text>
          <TextInput
            value={phone} 
            onChangeText={setPhone} 
            error={Boolean(error)}
            label='Номер телефона'
            placeholder='Например, +79019404698'
            mode='flat'
            style={{ marginTop: 10 }}
          />
          <TextInput
            value={appID} 
            onChangeText={setAppID} 
            error={Boolean(error)}
            label='App api_id'
            placeholder='Например, 12345678'
            mode='flat'
            style={{ marginTop: 10 }}
          />
          <TextInput
            value={appHash} 
            onChangeText={setAppHash} 
            error={Boolean(error)} 
            label='App api_hash'
            placeholder='Например, h25jozhmqjf2y85v064dcl'
            mode='flat'
            style={{ marginTop: 10 }}
          />
          {Boolean(error) && <HelperText type='error' visible={Boolean(error)}>{error}</HelperText>}
          <Button 
            mode='contained'
            onPress={() => {}} 
            style={styles.button}
          >
            Сохранить и отправить код
          </Button>
          <Button 
            mode='outlined'
            style={styles.button}
            onPress={() => resetNavigation(navigation, 'LoginPhone')}
          >
            Отмена
          </Button>
        </View>
      </View>
    </Container>
  )
}