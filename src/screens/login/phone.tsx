import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { View } from 'react-native'
import { Text, Button, HelperText, TextInput } from 'react-native-paper'
import { sendCode as sendCodeToMyTelegramOrg } from '../../../mytelegramorg/scraping'
import { useNavigation } from '@react-navigation/native'
import Container from '../../Container'
import styles from '../../styles/Login'
import Info from '../../components/Login/Info'
import { resetNavigation } from '../../../utils'

export default function LoginPhoneScreen() {
  const [phone, setPhone] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)
  const navigation = useNavigation()

  const sendCode = async () => {
    if(!phone) return setError('Введи телефон в поле выше')
    if(!phone.startsWith('+')) return setError('Телефон должен начинаться со знака +')
    setError(null)
    setLoading(true)
    
    const result = await sendCodeToMyTelegramOrg(phone)
    setLoading(false)
    if(result.error) {
      setError({
        'too_many_tries': 'Слишком много попыток или некорректный формат телефона'
      }[result.error] ?? result.error)
    } else {
      console.log(result)
      resetNavigation(navigation, 'MyTelegramLoginCode', { phone, random_hash: result.random_hash })
    }
  }

  React.useEffect(() => {
    if(phone === '8') {
      setPhone('+7')
    }
  }, [phone])

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
          <Info />
          
        </View>
      </View>
    </Container>
  )
}