import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { View } from 'react-native'
import { Text, Button, HelperText, TextInput } from 'react-native-paper'
import { useNavigation, useRoute } from '@react-navigation/native'
import Container from '../../Container'
import styles from '../../styles/Login'
import { resetNavigation, resetNavigationWithHistory } from '../../../utils'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { initializeAPI } from '../../../mtproto/react-native'
import { sendLoginCode } from '../../../mtproto'

export default function ManualTokensInput() {
  const [phone, setPhone] = React.useState<string>('')
  const [appID, setAppID] = React.useState<string>('')
  const [appHash, setAppHash] = React.useState<string>('')
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState<boolean>(false)
  const navigation = useNavigation()
  const route = useRoute()

  React.useEffect(() => {
    const phone = route.params?.phone
    phone && setPhone(phone)
  }, [route.params])

  React.useEffect(() => {
    if(phone === '8') {
      setPhone('+7')
    }
  }, [phone])

  React.useEffect(() => {
    process.env.NODE_ENV === 'development' && setPhone('+9996610000')
    AsyncStorage.getItem('app_api_id').then(data => setAppID(data))
    AsyncStorage.getItem('app_api_hash').then(data => setAppHash(data))
  }, [])

  React.useEffect(
    () => navigation.addListener('beforeRemove', (e) => { if (loading) e.preventDefault() }),
    [navigation, loading]
  )

  const saveAndContinue = async () => {
    if(!phone) return setError('Введите телефон в поле выше')
    if(!appID) return setError('Введите api_id в поле выше')
    if(!appHash) return setError('Введите api_hash в поле выше')
    setError(null)
    setLoading(true)
    try {
      await AsyncStorage.setItem('app_api_id', appID)
      await AsyncStorage.setItem('app_api_hash', appHash)
      await initializeAPI()
      const result = await sendLoginCode(phone)
      if(result.error) {
        setError({
          'phone_number_invalid': 'Некорректный формат номера телефона' 
        }[result.error] ?? result.error)
      } else {
        // navigation.reset({ routes: [{ name: 'LoginCode', params: { phone }}], index: 0 })
        // resetNavigation(navigation, 'LoginCode', { phone })
        // resetNavigationWithHistory(navigation, [{ name: 'LoginPhone' }, { name: 'LoginCode', params: { phone } }])
        navigation.push('LoginCode', { phone })
      }
    } catch(e) {
      console.error(e)
      setError(JSON.stringify(e))
    } finally {
      setLoading(false)
    }
  }

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
            disabled={loading}
            style={{ marginTop: 10 }}
          />
          <TextInput
            value={appID} 
            onChangeText={setAppID}
            error={Boolean(error)}
            label='App api_id'
            placeholder='Например, 12345678'
            mode='flat'
            disabled={loading}
            style={{ marginTop: 10 }}
          />
          <TextInput
            value={appHash} 
            onChangeText={setAppHash} 
            error={Boolean(error)} 
            label='App api_hash'
            placeholder='Например, h25jozhmqjf2y85v064dcl'
            mode='flat'
            disabled={loading}
            style={{ marginTop: 10 }}
          />
          {Boolean(error) && <HelperText type='error' visible={Boolean(error)}>{error}</HelperText>}
          <Button 
            mode='contained'
            onPress={saveAndContinue}
            disabled={loading}
            style={styles.button}
          >
            Сохранить и отправить код
          </Button>
        </View>
      </View>
    </Container>
  )
}