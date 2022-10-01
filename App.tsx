import { Button, Text, View } from 'react-native'
import { NativeRouter } from 'react-router-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LoginPhoneScreen from './src/screens/login/phone'
import LoginCodeScreen from './src/screens/login/code'

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} >
        <Stack.Screen name='LoginPhone' component={LoginPhoneScreen} />
        <Stack.Screen name='LoginCode' component={LoginCodeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

function test(arg1: string) {
  //
}