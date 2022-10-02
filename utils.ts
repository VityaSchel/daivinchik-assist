import type { NavigationProp } from '@react-navigation/native'
import { CommonActions } from '@react-navigation/native'
import { navigationRef } from './App'

type NavProp = NavigationProp<ReactNavigation.RootParamList>

export function resetNavigation(navigation: NavProp, routeName: string, params?: { [key: string]: any }) {
  navigation.dispatch(
    CommonActions.reset({ routes: [{ name: routeName, params }], index: 0 })
  )
}

export function resetNavigationWithHistory(navigation: NavProp, routes: { name: string, params?: { [key: string]: any } }[], index?: number) {
  index = index ?? routes.length - 1
  navigation.dispatch(
    CommonActions.reset({ routes: routes.map(r => ({ name: r.name, params: r.params })), index })
  )
}