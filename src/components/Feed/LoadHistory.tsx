import React from 'react'
import { View, Image } from 'react-native'
import { Text, Button } from 'react-native-paper'
import { findLeomatchPeer } from '../../../mtproto/importBotHistory'
import AboutDialog from './AboutDialog'

export default function LoadHistory() {
  const [howItWorksDialogVisible, setHowItWorksDialogVisibility] = React.useState(false)

  const loadHistory = async () => {
    await findLeomatchPeer()
  }
  
  return (
    <View>
      <Button 
        mode='contained'
        onPress={loadHistory}
      >Загрузить</Button>
      <Button 
        mode='outlined'
        onPress={() => setHowItWorksDialogVisibility(true)}
      >Как это работает?</Button>
      <AboutDialog visible={howItWorksDialogVisible} onHide={() => setHowItWorksDialogVisibility(false)} />
    </View>
  )
}