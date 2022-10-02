import React from 'react'
import { Text, Button } from 'react-native-paper'
import AboutLoginDialog from './AboutDialog'
import styles from '../../styles/Login'
import { Linking } from 'react-native'

export default function Info() {
  const [aboutDialogVisible, setAboutDialogVisible] = React.useState(false)

  return (
    <>
      <Button 
        mode='outlined' 
        onPress={() => setAboutDialogVisible(true)}
        style={styles.moreInfoButton}
      >
        Подробнее
      </Button>
      <AboutLoginDialog visible={aboutDialogVisible} onHide={() => setAboutDialogVisible(false)} />
      <Text style={styles.warning}>
        Это приложение работает только на вашем телефоне. 
        Ваши данные никогда не будут отправлены за пределы 
        этого устройства. <Text 
          style={styles.link}
          onPress={() => Linking.openURL('https://github.com/VityaSchel/daivinchik-assist')}
        >Код приложения на GitHub.</Text>
      </Text>
    </>
  )
}