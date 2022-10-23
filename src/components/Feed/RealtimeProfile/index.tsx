import React from 'react'
import { View } from 'react-native'
import { onMessage } from '../../../../mtproto/updates'

export default function RealtimeProfile() {

  React.useEffect(() => {
    onMessage(message => console.log(message.message))
  }, [])

  return (
    <View>

    </View>
  )
}