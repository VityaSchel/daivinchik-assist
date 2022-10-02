import { Provider } from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LoginPhoneScreen from './src/screens/login/phone'
import LoginCodeScreen from './src/screens/login/code'
import MyTelegramLoginCodeScreen from './src/screens/login/myTelegramOrgCode'
import ManualTokensInput from './src/screens/login/manualTokensInput'

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <Provider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }} >
          <Stack.Screen name='LoginPhone' component={LoginPhoneScreen} />
          <Stack.Screen name='MyTelegramLoginCode' component={MyTelegramLoginCodeScreen} />
          <Stack.Screen name='ManualTokensInput' component={ManualTokensInput} />
          <Stack.Screen name='LoginCode' component={LoginCodeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  )
}

function test(arg1: string) {
  //
}