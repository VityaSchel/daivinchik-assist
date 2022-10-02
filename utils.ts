import type { NavigationProp } from '@react-navigation/native'

type NavProp = NavigationProp<ReactNavigation.RootParamList>

export function resetNavigation(navigation: NavProp, routeName: string, params?: { [key: string]: any }) {
  navigation.reset({ routes: [{ name: routeName, params }], index: 0 })
}

export function resetNavigationWithHistory(navigation: NavProp, routes: { name: string, params?: { [key: string]: any } }[], index = 0) {
  navigation.reset({ routes: routes.map(r => ({ name: r.name, params: r.params })), index })
}