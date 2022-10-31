import { StyleSheet } from 'react-native'
import { useSafeAreaFrame } from 'react-native-safe-area-context'

type stylesheet = ReturnType<typeof StyleSheet.create>

export default function useResponsiveStyles(defaultStyles: stylesheet, compactStyles: stylesheet): stylesheet {
  const { height } = useSafeAreaFrame()
  if(height <= 350) return compactStyles
  else return defaultStyles
}