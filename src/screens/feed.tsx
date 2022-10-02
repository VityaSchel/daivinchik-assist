import React from 'react'
import { Text } from 'react-native'
import Container from '../Container'
import { useNavigation } from '@react-navigation/native'
import { resetNavigation } from '../../utils'

export default function FeedScreen() {
  const navigation = useNavigation()

  React.useEffect(() => {
    resetNavigation(navigation, 'Feed')
  }, [])

  return (
    <Container>
      <Text>Test</Text>
    </Container>
  )
}