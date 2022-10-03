import React from 'react'
import { View, Image } from 'react-native'
import { ProgressBar, Button, HelperText } from 'react-native-paper'
import { exportHistory, findLeomatchPeer } from '../../../mtproto/importBotHistory'
import AboutDialog from './AboutDialog'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function LoadHistory() {
  const [howItWorksDialogVisible, setHowItWorksDialogVisibility] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<null | string>(null)
  const [progress, setProgress] = React.useState(0)
  const [continueFrom, setContinueFrom] = React.useState<null | { exported: number, max: number, offset: number | undefined }>(null)
  const [exporting, setExporting] = React.useState(false)

  const loadHistory = async () => {
    setLoading(true)
    setError(null)

    const result = await findLeomatchPeer()
    if(result.error) {
      setLoading(false)
      setError({
        'unable_to_resolve_peer': 'Не удалось получить peer бота Дайвинчик. Возможно, он был удален из Telegram или вы используете устаревшую версию приложения.'
      }[result.error] ?? result.error)
    } else {
      setExporting(true)
      await AsyncStorage.setItem('init_history_export_state', 'started')
      const callback = (exported: number, max: number, offset: number) => {
        setProgress(exported / max)
        AsyncStorage.setItem('init_history_exported_msgs_process', JSON.stringify({ exported, max, offset }))
      }
      await exportHistory(result.peer, callback, continueFrom?.offset)
    }
  }

  React.useEffect(() => { checkState() }, [])

  const checkState = async () => {
    setLoading(true)
    const state = await AsyncStorage.getItem('init_history_export_state')
    if(state === 'started') {
      const dataRaw = await AsyncStorage.getItem('init_history_exported_msgs_process')
      if(!dataRaw) {
        setContinueFrom(null)
      } else {
        try {
          const data = JSON.parse(dataRaw)
          setContinueFrom({
            exported: Number(data.exported) || 0,
            max: Number(data.max) || 1,
            offset: Number(data.offset) || undefined
          })
        } catch(e) {
          setContinueFrom(null)
        }
      }
    } else {
      setContinueFrom(null)
    }
    setLoading(false)
  }
  
  return (
    <View>
      {!exporting && 
      (continueFrom === null 
        ? (
          <Button 
            mode='contained'
            onPress={loadHistory}
            disabled={loading}
          >
            Начать загрузку
          </Button>
        ) : (
          <Button 
            mode='contained'
            onPress={loadHistory}
            disabled={loading}
          >
            Продолжить загрузку ({Math.floor(continueFrom.exported/continueFrom.max)}%)
          </Button>
        )
      )
      }
      {Boolean(error) && <HelperText type='error' visible={Boolean(error)}>{error}</HelperText>}
      {exporting && <ProgressBar progress={progress} />}
      <Button 
        mode='outlined'
        onPress={() => setHowItWorksDialogVisibility(true)}
      >Как это работает?</Button>
      <AboutDialog visible={howItWorksDialogVisible} onHide={() => setHowItWorksDialogVisibility(false)} />
      <Button 
        mode='outlined'
        onPress={() => setLoading(false)}
      >[[ undo ]]</Button>
    </View>
  )
}