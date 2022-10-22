import React from 'react'
import { Provider, MD3LightTheme } from 'react-native-paper'
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LoginPhoneScreen from './src/screens/login/phone'
import LoginCodeScreen from './src/screens/login/code'
import MyTelegramLoginCodeScreen from './src/screens/login/myTelegramOrgCode'
import ManualTokensInput from './src/screens/login/manualTokensInput'
import SearchingTokensScreen from './src/screens/login/searchingTokens'
import Login2faScreen from './src/screens/login/twofa'
import FeedScreen from './src/screens/feed'
import * as SplashScreen from 'expo-splash-screen'
import { MessageRealmContext } from './src/models/index'
import { Button } from 'react-native'

SplashScreen.preventAutoHideAsync()

const Stack = createNativeStackNavigator()

const navigationRef = createNavigationContainerRef()

export default function App() {
  return (
    <MessageRealmContext.RealmProvider>
      <Main />
    </MessageRealmContext.RealmProvider>
  )
}

function Main() {
  const realm = MessageRealmContext.useRealm()
  console.log('1', realm)

  React.useEffect(() => {
    global.realm = realm
  }, [realm])

  return (
    <Provider theme={MD3LightTheme}>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator screenOptions={{ headerShown: false }} >
          <Stack.Screen name='LoginPhone' component={LoginPhoneScreen} />
          <Stack.Screen name='MyTelegramLoginCode' component={MyTelegramLoginCodeScreen} />
          <Stack.Screen name='SearchingTokens' component={SearchingTokensScreen} />
          <Stack.Screen name='ManualTokensInput' component={ManualTokensInput} />
          <Stack.Screen name='LoginCode' component={LoginCodeScreen} />
          <Stack.Screen name='TwoFA' component={Login2faScreen} />
          <Stack.Screen name='Feed' component={FeedScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  )
}