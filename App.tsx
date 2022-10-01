import { Button, StyleSheet, Text, View } from 'react-native'
import { NativeRouter } from 'react-router-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LoginPhoneScreen from './src/screens/login/phone'
import LoginCodeScreen from './src/screens/login/code'

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    // <View style={styles.container}>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name='LoginPhone' component={LoginPhoneScreen} />
        <Stack.Screen name='LoginCode' component={LoginCodeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    // </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    // width: 100
  },
})

function test(arg1: string) {
  //
}